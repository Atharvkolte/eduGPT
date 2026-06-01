#main
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, Generator

from GPTv2 import OllamaGpt

# ============================================================
# APP CONFIG
# ============================================================

app = FastAPI(
    title="Ollama GPT API",
    description="FastAPI backend for Qwen via Ollama",
    version="1.0.0"
)

# ------------------------------------------------------------
# CORS (REQUIRED FOR FRONTEND)
# ------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # later restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------
# GPT INSTANCE
# ------------------------------------------------------------
gpt = OllamaGpt()

# ============================================================
# SCHEMAS
# ============================================================

class ChatRequest(BaseModel):
    message: str
    thread_id: int


class ChatResponse(BaseModel):
    response: str
    thread_id: int
    success: bool


# ============================================================
# ROUTES
# ============================================================

@app.get("/")
def root():
    return {
        "service": "Ollama GPT API",
        "endpoints": [
            "/chat",
            "/health"
        ]
    }


@app.get("/health")
def health():
    return {"status": "ok"}


# ------------------------------------------------------------
# NORMAL CHAT (JSON RESPONSE)
# ------------------------------------------------------------
@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    try:
        result = gpt.generate_response(
            request.message,
            request.thread_id
        )

        # Handle both return styles safely
        if isinstance(result, tuple):
            reply, thread_id = result
        else:
            reply = result
            thread_id = request.thread_id

        return {
            "response": reply,
            "thread_id": thread_id,
            "success": True
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )




# ============================================================
# LOCAL DEV ENTRYPOINT
# ============================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
