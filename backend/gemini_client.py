import google.generativeai as genai
import logger as logger
import os

log = logger.getLogger()

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

generation_config = {
    "temperature": 0.1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}


# Function to call the Gemini API
def call_gemini_api(prompt):
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel(
        "gemini-1.5-flash", generation_config=generation_config
    )

    try:
        return model.generate_content(f"{prompt}").text
    except Exception as e:
        log.error(f"Cant call Gemini response for prompt {prompt}: {e}")
        raise e
