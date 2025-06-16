import os
import queryDocs
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


@app.route("/upload", methods=["Post"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"message": "No file uploaded."}), 400
    
    file = request.files["file"]
    file_extension = os.path.splitext(file.filename)[1].lower()

    if not file.filename:
        return jsonify({"message": "No file selected for upload."}), 400
    
    if file_extension != '.pdf' and file_extension != '.docx':
        return jsonify({"message": "Only .pdf or .docx allowed."}), 400

    extracted_text = queryDocs.extract_text_and_file_extension(file, file_extension)

    if not extracted_text.strip():
        return jsonify({"message": "Could not extract text from the document. It might be empty, corrupted, or contain no extractable text."}), 400
    
    queryDocs.delete_all_documents()

    try:
        rag_process_result = queryDocs.process_document_for_rag(file.filename, file_extension, extracted_text)
        if rag_process_result:
            return jsonify({"message": f"File {file.filename} uploaded successfully!"}), 200
        return jsonify({"message": "Something went wrong."}), 400
    
    except Exception as e:
        logging.error("Server error during rag processing", exc_info=True)
        return jsonify({"message": f"Internal server error: {e}"}), 500



@app.route("/prompt", methods=["POST"])
def process_prompt():
    data = request.json
    prompt = data.get("prompt", "")

    if not prompt:
        return jsonify({"message": "Prompt cannot be empty. Please provide a valid prompt."}), 400
    
    try:
        answer = queryDocs.answer_question_from_docs(prompt)
        return jsonify({"message": "Answer generated successfully!", "answer": answer}), 200
    
    except Exception as e:
        logging.error("Server error during prompt processing", exc_info=True)
        return jsonify({"message": f"Internal server error: {e}"}), 500
