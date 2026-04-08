from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.post_service import PostService

router = APIRouter(prefix="/posts", tags=["Posts"])
post_service = PostService()

@router.get("/")
async def get_posts(db: AsyncSession = Depends(get_db)):
    return await post_service.get_all_posts(db)