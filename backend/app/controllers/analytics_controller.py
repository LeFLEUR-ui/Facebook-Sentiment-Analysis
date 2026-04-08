from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db

from datetime import datetime

from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics"])
service = AnalyticsService()

@router.get("/dashboard")
async def get_dashboard_data(
    start_date: str = Query(..., example="2026-03-05"),
    end_date: str = Query(..., example="2026-04-04"),
    db: AsyncSession = Depends(get_db)
):
    start = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")
    
    return await service.get_dashboard_stats(db, start, end)

@router.get("/notifications")
async def get_notifications(db: AsyncSession = Depends(get_db)):
    return await service.get_recent_notifications(db)