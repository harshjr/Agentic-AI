from pydantic import BaseModel, Field
from typing import List, Optional

class ResearchRequest(BaseModel):
    topic: str = Field(..., min_length=2, max_length=500, description="The research topic or question", example="Advances in AI Agent Systems 2026")

class ResearchMetadata(BaseModel):
    sources: List[str] = Field(default_factory=list, description="List of source URLs referenced during research")
    timestamp: str = Field(..., description="ISO 8601 UTC timestamp of report generation")

class ResearchResponse(BaseModel):
    report: str = Field(..., description="Full structured markdown research report")
    critic: str = Field(..., description="Strict evaluation breakdown, score, strengths, and verdict")
    metadata: ResearchMetadata = Field(..., description="Research metadata including citations and timestamp")
