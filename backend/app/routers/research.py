from fastapi import APIRouter, HTTPException, status
from app.schemas.research import ResearchRequest, ResearchResponse
from app.services.research_service import ResearchService
import logging

logger = logging.getLogger("research_router")
router = APIRouter(tags=["Research"])

@router.post(
    "/research",
    response_model=ResearchResponse,
    status_code=status.HTTP_200_OK,
    summary="Run Autonomous Research Pipeline",
    description="Execute the 4-agent research workflow (Search, Scraping, Writing, Critic) on any given topic."
)
async def conduct_research(payload: ResearchRequest):
    topic = payload.topic.strip()
    if not topic:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Topic cannot be empty or whitespace only."
        )
    
    try:
        result = ResearchService.run_pipeline(topic=topic)
        return ResearchResponse(**result)
    except ValueError as ve:
        logger.error(f"Configuration or validation error during research: {ve}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(ve)
        )
    except Exception as e:
        logger.error(f"Unexpected error executing research pipeline: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Research agent pipeline failed: {str(e)}"
        )
