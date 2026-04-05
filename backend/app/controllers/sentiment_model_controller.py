from fastapi import APIRouter

from app.services.sentiment_model_service import SentimentModelService


router = APIRouter(prefix="/ml", tags=["Machine Learning"])
service = SentimentModelService()


@router.post("/analyze")
async def analyze_comments(payload: dict):
    raw_text = payload.get("text", "")
    return service.analyze_bulk(raw_text)