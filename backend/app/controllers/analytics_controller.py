from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db

from datetime import datetime, timezone

from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics"])
service = AnalyticsService()

@router.get("/dashboard")
async def get_dashboard_data(
    start_date: str = Query(..., examples=["2026-03-05"]),
    end_date: str = Query(..., examples=["2026-04-04"]),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d").replace(tzinfo=timezone.utc)
        end = datetime.strptime(end_date, "%Y-%m-%d").replace(hour=23, minute=59, second=59, tzinfo=timezone.utc)
    except ValueError:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")
    
    return await service.get_dashboard_stats(db, start, end, search)

@router.get("/notifications")
async def get_notifications(db: AsyncSession = Depends(get_db)):
    return await service.get_recent_notifications(db)