from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime

class ArticleBase(BaseModel):
    title: str = Field(..., min_length=20)
    content: str = Field(..., min_length=200)
    category: str = Field(..., min_length=3)
    status: str

    @field_validator('status')
    @classmethod
    def validate_status(cls, value: str):
        allowed_status = ["publish", "draft", "thrash"]
        val_lower = value.lower()
        if val_lower not in allowed_status:
            raise ValueError(f"Status harus salah satu dari: {', '.join(allowed_status)}")
        return val_lower

class ArticleCreate(ArticleBase):
    pass

class ArticleUpdate(ArticleBase):
    pass

class ArticleResponse(ArticleBase):
    id: int
    created_date: Optional[datetime] = None
    updated_date: Optional[datetime] = None

    class Config:
        from_attributes = True