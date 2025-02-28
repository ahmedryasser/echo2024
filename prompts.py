# Define prompts for different output types with improved clarity and consistency
OUTPUT_PROMPTS = {
    'qa': (
        "Create 10 questions based on the key concepts discussed in the lecture or meeting. "
        "Provide correct answers with brief explanations for each question. "
        "Return the output as plain text using the following format without any markdown or special fonts:\n"
        "Q<n>: <question text>\n"
        "A<n>: <answer text>\n"
        "(<n> represents the question number, starting from 1)\n"
        "Following content: "
    ),
    'transcripts': (
        "Generate a detailed and well-structured transcript from the following content. "
        "Ensure that speaker names and any transitions are clearly indicated.\n"
        "Transcript content: "
    ),
    'notes': (
        "Based on the provided lecture or meeting transcript, summarize the overall theme and extract ten key points. "
        "Create a set of concise notes for easy review. Each note should follow this format:\n"
        "Keyword 1: Explanation and summary\n"
        "Keyword 2: Explanation and summary\n"
        "...\n"
        "Keyword 10: Explanation and summary\n"
        "Transcript: "
    ),
    'summary': (
        "Generate a comprehensive summary of the following content. "
        "Ensure that the summary is clear, well-organized, and covers all the main points.\n"
        "Content: "
    ),
    'learning_objectives': (
        "From the provided lecture transcript, identify the top 10 primary learning objectives. "
        "Adhere strictly to the following format, keeping the total output within 1000 characters. "
        "List each objective as follows:\n"
        "Objective 1,\n"
        "Objective 2,\n"
        "...\n"
        "Objective 10\n"
        "Do not include any additional explanations or commentary."
    ),
    'action_items': (
        "Generate 8 action items based on the discussion in the meeting. If possible, list them in order of both importance and urgency. "
        "For each item, include the following details formatted exactly as shown:\n"
        "1. Task: <task description>\n"
        "   Responsible Person: <name>\n"
        "   Deadline: <date/time>\n"
        "2. Task: <task description>\n"
        "   Responsible Person: <name>\n"
        "   Deadline: <date/time>\n"
        "...\n"
    ),
}
