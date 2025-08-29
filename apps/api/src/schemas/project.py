from pydantic import BaseModel
from typing import Optional
from datetime import date

class ProjectCreate(BaseModel):
    name: str
    client_id: Optional[int] = None
    status: Optional[str] = "draft"
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class ProjectOut(BaseModel):
    id: int
    name: str
    client_id: Optional[int] = None
    status: str
    class Config:
        from_attributes = True
