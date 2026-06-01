import requests
import os
from dotenv import load_dotenv

load_dotenv()

def search_images(query, num_results=5):
    api_key = os.getenv("SERPAPI_KEY")

    if not api_key:
        raise ValueError("SERPAPI_KEY not found in environment variables")

    url = "https://serpapi.com/search"

    params = {
        "engine": "google_images",
        "q": query,
        "api_key": api_key
    }

    response = requests.get(url, params=params)
    data = response.json()

    images = []

    for img in data.get("images_results", [])[:num_results]:
        images.append(img["original"])

    return images

if __name__ == "__main__":
    query = "puppies"
    images = search_images(query)
    for idx, img_url in enumerate(images):
        print(f"{idx + 1}. {img_url}")