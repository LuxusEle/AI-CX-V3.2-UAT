from pydantic import BaseModel
from typing import Optional

class POCreate(BaseModel):
    vendor_id: Optional[int] = None
    project_id: Optional[int] = None
    status: Optional[str] = "draft"
    total: float = 0

class POOut(BaseModel):
    id: int
    vendor_id: Optional[int]
    project_id: Optional[int]
    status: str
    total: float
    class Config:
        from_attributes = True
