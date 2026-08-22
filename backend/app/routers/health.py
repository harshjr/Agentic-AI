from fastapi import APIRouter
from app.schemas.health import HealthResponse
from app.core.config import settings

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Check API operational health status."""
    return HealthResponse(
        status="healthy",
        version=settings.VERSION
    )
