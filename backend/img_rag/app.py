from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from serpapi_image_search import search_images

# ------------------------
# Initialize FastAPI
# ------------------------

app = FastAPI(title="Image Search API")

# ------------------------
# Enable CORS
# ------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------
# Request Schema
# ------------------------

class ImageSearchRequest(BaseModel):
    query: str
    top_k: int = 5


# ------------------------
# Search Endpoint
# ------------------------

@app.post("/search-images")
def get_images(request: ImageSearchRequest):

    images = search_images(
        query=request.query,
        num_results=request.top_k
    )

    results = [
        {"image_url": url}
        for url in images
    ]

    return {
        "query": request.query,
        "results": results
    }


# ------------------------
# Health Check
# ------------------------

@app.get("/")
def health():
    return {"status": "API running 🚀"}


# ------------------------
# Run Server
# ------------------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=4000,
        reload=True
    )