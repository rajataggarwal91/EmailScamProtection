from sentence_transformers import SentenceTransformer

# Load pre-trained model
model = SentenceTransformer("all-MiniLM-L6-v2")


def get_embeddings(text):
    # Convert the text to a list of sentences (or you can pass a single string)
    sentences = str(text).split(
        "."
    )  # Splitting text into sentences for better semantic search
    embeddings = model.encode(sentences)
    return sentences, embeddings
