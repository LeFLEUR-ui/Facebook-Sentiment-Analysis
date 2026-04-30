from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.post_service import PostService
from datetime import datetime, timezone
from typing import Optional

router = APIRouter(prefix="/posts", tags=["Posts"])
post_service = PostService()

@router.get("/")
async def get_posts(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    start = datetime.strptime(start_date, "%Y-%m-%d").replace(tzinfo=timezone.utc) if start_date else None
    end = datetime.strptime(end_date, "%Y-%m-%d").replace(hour=23, minute=59, second=59, tzinfo=timezone.utc) if end_date else None
    return await post_service.get_all_posts(db, start_date=start, end_date=end)