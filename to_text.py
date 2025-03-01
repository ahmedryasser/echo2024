# to_text.py

import subprocess
import ffmpeg
import speech_recognition as sr
from pydub import AudioSegment
import os
import PyPDF2
from vosk import Model, KaldiRecognizer
import json
import wave

def to_text(file_input_path):
    """
    Process an input file and extract text either by:
      - getting text from a PDF,
      - transcribing the spoken content of a video (extracting audio first with ffmpeg), or
      - transcribing an audio file.
    """
    file_extension = os.path.splitext(file_input_path)[1].lower()
    # Initialize Vosk model
    model = Model(lang="en-us")
    
    if file_extension == ".pdf":
        # Extract and return text from PDF
        return extract_text_from_pdf(file_input_path)
    elif file_extension in ['.mp4', '.mov', '.avi', '.mkv']:
        # Video file: extract audio then transcribe
        temp_audio_path = "temp_audio.wav"
        try:
            (
                ffmpeg
                .input(file_input_path)
                .output(temp_audio_path, ac=1, ar=16000, format='wav')
                .overwrite_output()
                .run(quiet=True)
            )
            transcription = transcribe_audio(temp_audio_path, model)
            os.remove(temp_audio_path)
            return transcription
        except Exception as e:
            print("Error processing video file:", e)
            return ""
    else:
        # Assume it's an audio file.
        # For non-WAV files, convert to WAV with the desired audio settings.
        if file_extension != '.wav':
            temp_audio_path = "temp_audio.wav"
            try:
                (
                    ffmpeg
                    .input(file_input_path)
                    .output(temp_audio_path, ac=1, ar=16000, format='wav')
                    .overwrite_output()
                    .run(quiet=True)
                )
                transcription = transcribe_audio(temp_audio_path, model)
                os.remove(temp_audio_path)
                return transcription
            except Exception as e:
                print("Error processing audio file:", e)
                return ""
        else:
            try:
                transcription = transcribe_audio(file_input_path, model)
                return transcription
            except Exception as e:
                print("Error processing WAV file:", e)
                return ""

def transcribe_audio(audio_path, model):
    """
    Uses the Vosk model to transcribe a WAV audio file.
    It reads audio in chunks and collects intermediate results.
    """
    try:
        wf = wave.open(audio_path, 'rb')
    except Exception as e:
        print("Error opening audio file:", e)
        return ""
    
    # Vosk works best with mono audio
    if wf.getnchannels() != 1:
        print("Audio is not mono. Converting to mono might be required.")
        return ""
    
    recognizer = KaldiRecognizer(model, wf.getframerate())
    recognizer.SetWords(True)
    results = []
    
    while True:
        data = wf.readframes(4000)
        if len(data) == 0:
            break
        if recognizer.AcceptWaveform(data):
            res = json.loads(recognizer.Result())
            results.append(res.get('text', ''))
    
    final_res = json.loads(recognizer.FinalResult())
    results.append(final_res.get('text', ''))
    
    transcription = " ".join(results).strip()
    return transcription

def extract_text_from_pdf(pdf_path):
    """
    Extracts text from a PDF file using PyPDF2 and returns a cleaned version.
    """
    text = ''
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            cleaned_text = ' '.join(text.split())
    except Exception as e:
        print(f'Error extracting text from PDF: {e}')
        cleaned_text = ""
    return cleaned_text
