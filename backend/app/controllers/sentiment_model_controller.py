from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.schemas import AnalysisRequest, BulkAnalysisResponse
from app.services.sentiment_model_service import SentimentModelService


router = APIRouter(prefix="/ml", tags=["Machine Learning"])

sentiment_service = SentimentModelService()

@router.post("/analyze", response_model=BulkAnalysisResponse)
async def analyze_comments(payload: AnalysisRequest, db: AsyncSession = Depends(get_db)):
    return await sentiment_service.analyze_bulk_and_save(
        db, 
        post_content=payload.post_content, 
        raw_text=payload.raw_text
    )



@router.get("/stats")
async def get_comment_stats(db: AsyncSession = Depends(get_db)):
    """
    Returns total comments and sentiment breakdown.
    """
    stats = await sentiment_service.get_comment_stats(db)
    return stats


@router.get("/trends")
async def get_trends(db: AsyncSession = Depends(get_db)):
    """Returns daily breakdown for the Growth Analysis Bar chart"""
    return await sentiment_service.get_daily_trends(db)