from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Possible responses
scam_responses = [
    {
        "scam": True,
        "description": "The email contains suspicious keywords often associated with phishing attempts."
    },
    {
        "scam": True,
        "description": "The email asks for personal information, which is a common scam tactic."
    },
    {
        "scam": False,
        "description": "The email appears legitimate and does not contain any suspicious patterns."
    },
    {
        "scam": False,
        "description": "This email comes from a trusted sender and matches expected patterns."
    }
]

@app.route('/email', methods=['POST'])
def process_email():
    data = request.json
    subject = data.get('subject', 'No subject provided')
    body = data.get('body', 'No body provided')

    print(f"Received Email - Subject: {subject}, Body: {body}")

    # Randomly select a scam response
    random_response = random.choice(scam_responses)

    response = {
        'message': 'Email processed successfully',
        'subject': subject,
        'body': body,
        'is_scam': random_response['scam'],
        'description': random_response['description']
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
