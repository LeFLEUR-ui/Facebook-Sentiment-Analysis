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
    """
    Takes raw text, extracts comments, performs sentiment analysis, 
    and saves results to the database.
    """
    result = await sentiment_service.analyze_bulk_and_save(db, payload.raw_text)
    
    return result