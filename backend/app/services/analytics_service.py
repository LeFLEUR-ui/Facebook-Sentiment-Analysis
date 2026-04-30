from typing import Optional
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import SentimentRecord, Post
from datetime import datetime

class AnalyticsService:
    async def get_dashboard_stats(self, db: AsyncSession, start_date: datetime, end_date: datetime, search: Optional[str] = None):

        stmt = (
            select(
                func.date(SentimentRecord.created_at).label("date"),
                func.count(SentimentRecord.id).label("total"),
                func.count(SentimentRecord.id).filter(SentimentRecord.sentiment_label == 'positive').label("pos"),
                func.count(SentimentRecord.id).filter(SentimentRecord.sentiment_label == 'negative').label("neg"),
                func.count(SentimentRecord.id).filter(SentimentRecord.sentiment_label == 'neutral').label("neu")
            )
            .where(SentimentRecord.created_at.between(start_date, end_date))
        )

        if search:
            stmt = stmt.join(Post, SentimentRecord.post_id == Post.id)
            stmt = stmt.where(Post.content.ilike(f"%{search}%"))

        stmt = stmt.group_by("date").order_by("date")
        
        result = await db.execute(stmt)
        rows = result.all()

        labels = [str(r.date) for r in rows]
        pos_data = [r.pos for r in rows]
        neg_data = [r.neg for r in rows]
        neu_data = [r.neu for r in rows]

        return {
            "labels": labels,
            "sentiment": {
                "positive": sum(pos_data),
                "negative": sum(neg_data),
                "neutral": sum(neu_data)
            },
            "timeline": {
                "positive": pos_data,
                "negative": neg_data,
                "neutral": neu_data
            }
        }
    
    async def get_recent_notifications(self, db: AsyncSession, limit: int = 5):
        stmt = (
            select(SentimentRecord)
            .order_by(SentimentRecord.created_at.desc())
            .limit(limit)
        )
        result = await db.execute(stmt)
        records = result.scalars().all()
        
        return [
            {
                "id": r.id,
                "title": f"New {r.sentiment_label} comment from {r.username}",
                "time": "Just now",
                "sentiment": r.sentiment_label
            } for r in records
        ]