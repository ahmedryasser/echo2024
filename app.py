from langchain_ollama import OllamaLLM
from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
import logging
import re
import PyPDF2
import os
from werkzeug.utils import secure_filename
import to_text
from prompts import OUTPUT_PROMPTS
import dotenv

# Setup basic logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)
CORS(app)
app.config['MAX_CONTENT_LENGTH'] = 1024 * 1024 * 1024  # 1GB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'mp3', 'mp4'}
dotenv.load_dotenv()
model_val = os.getenv('model')

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Check if the file extension is allowed
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Extract text from a PDF file
def extract_text_from_pdf(file_path):
    try:
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text
    except Exception as e:
        logging.error(f"Error extracting text from PDF: {e}")
        return None


# Initialize the LLaMA model
def initialize_llama():
    try:
        # Initialize the LLaMA model directly
        llama_model = OllamaLLM(model=model_val)
        return llama_model
    except Exception as e:
        logging.error(f"Failed to initialize LLM: {e}")
        raise

llama_model = initialize_llama()

# Prompt the LLaMA model
def prompt_ollama(content, output_type):

    predefined_prompt = OUTPUT_PROMPTS[output_type]
    response = None
    if output_type in OUTPUT_PROMPTS:
        prompt = f"{predefined_prompt} {content}"
    try:
        response = llama_model.invoke(prompt)
    except Exception as e:
        logging.error(f"Error invoking LLM: {e}")

    return response

def extract_qa_pairs(text):
    # Split the text into individual QA pairs
    qa_pairs = []
    
    # Find all questions using regex
    questions = re.findall(r'Q\d+:\s*(.*?)\s*(?=A\d+:|$)', text)

    # Find all answers using regex
    answers = re.findall(r'A\d+:\s*(.*?)\s*(?=Q\d+:|$)', text)
    
    # Combine questions and answers into pairs
    for i in range(len(questions)):
        if i < len(answers):
            qa_pairs.append({
                'question': questions[i].strip(),
                'answer': answers[i].strip()
            })

    # Desired output format
    ret = []
    for i, pair in enumerate(qa_pairs, 1):
        ret.append({
            'question': pair['question'],
            'answer': pair['answer']
        })
    
    return ret

@app.route('/api/extract-text', methods=['POST'])
def extract_text_route():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if file and allowed_file(file.filename):

        # Save the file to the upload folder
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # call to_text.py to extract text for different file types
        text_content = to_text.to_text(filepath)
        os.remove(filepath)

        temp_audio_path = os.path.join(app.config['UPLOAD_FOLDER'], 'audio.wav')
        if os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)

        if text_content is None:
            return jsonify({'error': 'Failed to extract text from the file'}), 500

        return jsonify({'text': text_content}), 200

    return jsonify({'error': 'Invalid file type'}), 400

            
# Main route for the Flask app
@app.route('/api/process-content', methods=['POST'])
def process_content():
    data = request.get_json()
    content = data.get('content', '')
    data_types = data.get('data_types', [])

    if not content:
        return jsonify({'error': 'No content provided'}), 400

    results = {}

    for data_type in data_types:
        model_result = prompt_ollama(content, data_type)
        print("data_type:", data_type)
        print("model_result:", model_result)
        if data_type == 'qa':
            results[data_type] = extract_qa_pairs(model_result)
        else:
            results[data_type] = model_result

    #print("results:", results)

    return jsonify(results), 200

if __name__ == '__main__':
    app.run(debug=True)
