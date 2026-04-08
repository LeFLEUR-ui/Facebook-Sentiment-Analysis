from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import Post


class PostService:
    async def get_all_posts(self, db: AsyncSession, limit: int = 10):
        stmt = select(Post).order_by(desc(Post.created_at)).limit(limit)
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