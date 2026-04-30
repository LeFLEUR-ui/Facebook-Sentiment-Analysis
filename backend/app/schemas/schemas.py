from typing import Dict, List

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True


class AnalysisRequest(BaseModel):
    post_content: str
    raw_text: str = Field(..., description="The raw text pasted from the comment section")
    scan_date: str = Field(None, description="Optional date for the scan (YYYY-MM-DD)")

class SentimentResult(BaseModel):
    name: str
    comment: str
    sentiment: str
    score: float

    class Config:
        from_attributes = True

class BulkAnalysisResponse(BaseModel):
    results: List[SentimentResult]
    summary: Dict[str, int]
    total: int