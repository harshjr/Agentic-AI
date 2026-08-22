import os
from langchain_groq import ChatGroq
from app.core.config import settings

def get_llm(temperature: float = 0.0) -> ChatGroq:
    api_key = settings.GROQ_API_KEY or os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY is not set in environment or config.")
    
    # Use configured model or robust default
    model = settings.GROQ_MODEL or os.getenv("GROQ_MODEL") or "llama-3.3-70b-versatile"
    
    return ChatGroq(
        model=model,
        temperature=temperature,
        groq_api_key=api_key
    )
