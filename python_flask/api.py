from flask import Flask, request, jsonify

app = Flask(__name__)

# Endpoint to receive subject and body
@app.route('/email', methods=['POST'])
def process_email():
    data = request.json
    subject = data.get('subject', 'No subject provided')
    body = data.get('body', 'No body provided')

    print(f"Received Email - Subject: {subject}, Body: {body}")

    # Example: Perform processing and return a response
    response = {
        'message': 'Email processed successfully',
        'subject_length': len(subject),
        'body_length': len(body)
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
