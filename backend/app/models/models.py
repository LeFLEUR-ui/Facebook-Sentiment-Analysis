import datetime

from sqlalchemy import Column, DateTime, Float, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, index=True, nullable=False)


class SentimentRecord(Base):
    __tablename__ = "sentiment_records"
    __table_args__ = {"schema": "public"}

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=True)
    username = Column(String, nullable=False)
    comment_text = Column(String, nullable=False)
    sentiment_label = Column(String, nullable=False)
    confidence_score = Column(Float, nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
        nullable=False
    )

    post = relationship("Post", back_populates="sentiment_records")


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    reactions_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    shares_count = Column(Integer, default=0)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
        nullable=False
    )

    sentiment_records = relationship("SentimentRecord", back_populates="post")