import faiss
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

import embedding_transformer as et
import gemini_client as gc

# Initialize the Flask app
app = Flask(__name__)
CORS(app)

# Initialize FAISS index for storing vectors
dimension = 384  # Example dimension for vectors (can change based on your use case)
index = faiss.IndexFlatL2(dimension)  # Using L2 distance for simplicity

# Store vectors and metadata (optional)
vector_data = []
metadata = {}


@app.route("/api/ingest", methods=["POST"])
def add_vector():
    """
    Adds a vector to the FAISS index.
    Expects a JSON body with 'vector' (list of floats) and optional 'metadata' (dict).
    """

    with open("backend/reddit_scams_data_cleaned.txt", "r") as f:
        data = f.read()

    sentences, embeddings = et.get_embeddings(data)
    vector_data.extend(sentences)

    # Convert embeddings to numpy array and add them to the FAISS index
    embeddings_np = np.array(embeddings).astype("float32")
    index.add(embeddings_np)

    # Save the FAISS index to disk
    faiss.write_index(index, "faiss_index.index")
    return jsonify({"message": "Vector added successfully", "id": 1}), 200


@app.route("/api/query", methods=["POST"])
def query_vector():
    """
    Queries the FAISS index.
    Expects a JSON body with 'vector' (list of floats) and optional 'k' (number of nearest neighbors).
    """
    try:
        data = request.json
        subject = data.get("subject", "No subject provided")
        body = data.get("body", "No body provided")

        query = f"Email - Subject: {subject}, Body: {body}"

        # Get the query embedding
        _, query_embedding = et.get_embeddings(query)
        if query_embedding is None or len(query_embedding) == 0:
            raise ValueError("Failed to generate embedding for the query.")

        # Ensure the query embedding has the correct shape and data type
        query_embedding = np.array(
            query_embedding, dtype=np.float32
        )  # Reshape to (1, dimension)
        if (
            query_embedding.shape[1] != dimension
        ):  # 'dimension' should match the index dimension
            raise ValueError(
                f"Query embedding dimension mismatch. Expected {dimension}, got {query_embedding.shape[1]}."
            )

        # print("Number of vectors in index:", index.ntotal)

        # Perform the search to get the most similar sentence embeddings
        k = 1  # Number of nearest neighbors to retrieve
        distances, indices = index.search(query_embedding, k)

        # Check if valid indices were found
        relevant_sentences = []
        for idx in indices[0]:
            if idx != -1:  # Valid index
                relevant_sentences.append(vector_data[idx])

        # Use answerer to form an answer back to the user
        answer = gc.call_gemini_api(
            f"""
            You are a bot that helps detect scammer emails. You are given the following email:
            Email contents: {query}
            
            Pleae return a response in json format:
                is_scam: <true/false>,
                reason: <reason for scam>
            
            Reply only based on the following discussions that happened on Reddit posts:
            : {relevant_sentences}
            
            """
        )
        return jsonify(answer.replace("json", "").replace("```", "")), 200

    except Exception as e:
        # Log the error for debugging
        app.logger.error(f"Error in query_vector: {str(e)}")
        return jsonify({"error": "An internal error occurred"}), 500


@app.route("/api/clear", methods=["POST"])
def clear_index():
    """
    Clears the FAISS index and associated data.
    """
    global index, vector_data, metadata
    index = faiss.IndexFlatL2(dimension)  # Reinitialize FAISS index
    vector_data = []
    metadata = {}

    return jsonify({"message": "Index and data cleared successfully"}), 200


# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
