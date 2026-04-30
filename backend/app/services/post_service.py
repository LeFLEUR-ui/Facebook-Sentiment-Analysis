from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from typing import Optional

from app.models.models import Post


class PostService:
    async def get_all_posts(self, db: AsyncSession, limit: int = 100, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None):
        stmt = select(Post)
        
        if start_date and end_date:
            stmt = stmt.where(Post.created_at.between(start_date, end_date))
        elif start_date:
            stmt = stmt.where(Post.created_at >= start_date)
        elif end_date:
            stmt = stmt.where(Post.created_at <= end_date)
            
        stmt = stmt.order_by(desc(Post.created_at)).limit(limit)
        result = await db.execute(stmt)
        posts = result.scalars().all()

        return [
            {
                "id": f"post-{p.id}",
                "date": p.created_at.strftime("%b %d, %Y %H:%M"),
                "content": p.content,
                "reactions": p.reactions_count,
                "comments": p.comments_count,
                "shares": p.shares_count,
            }
            for p in posts
        ]