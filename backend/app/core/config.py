from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "LangChain Research Agent API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = ""
    
    # LLM & Tools Keys
    GROQ_API_KEY: str = ""
    TAVILY_API_KEY: str = ""
    GROQ_MODEL: str = "openai/gpt-oss-120b"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "https://*.vercel.app",
        "*"
    ]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
