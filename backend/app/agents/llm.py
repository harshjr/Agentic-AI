import os
from langchain_groq import ChatGroq
from app.core.config import settings

def get_llm(temperature: float = 0.0) -> ChatGroq:
    api_key = settings.GROQ_API_KEY or os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY is not set in environment or config.")
    
    return ChatGroq(
        model=settings.GROQ_MODEL,
        temperature=temperature,
        groq_api_key=api_key
    )
