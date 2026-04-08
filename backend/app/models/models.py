import datetime

from sqlalchemy import Column, DateTime, Float, Integer, String

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, index=True, nullable=False)


class SentimentRecord(Base):
    __tablename__ = "sentiment_records"  # table name
    __table_args__ = {"schema": "public"}  # adjust schema if needed

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)          # matches extracted name
    comment_text = Column(String, nullable=False)      # matches extracted comment
    sentiment_label = Column(String, nullable=False)   # "positive", "negative", "neutral", "analysis_error"
    confidence_score = Column(Float, nullable=False)   # sentiment score 0.0 - 1.0
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
        nullable=False
    )