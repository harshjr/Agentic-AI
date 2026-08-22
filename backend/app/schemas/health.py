from pydantic import BaseModel, Field

class HealthResponse(BaseModel):
    status: str = Field(default="healthy", description="Current system operational health status")
    version: str = Field(default="1.0.0", description="API version")
