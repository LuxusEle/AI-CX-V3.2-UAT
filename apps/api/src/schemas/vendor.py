from pydantic import BaseModel
from typing import Optional

class VendorCreate(BaseModel):
    name: str
    contact: Optional[str] = None
    payment_terms: Optional[str] = None

class VendorOut(BaseModel):
    id: int
    name: str
    contact: Optional[str] = None
    payment_terms: Optional[str] = None
    class Config:
        from_attributes = True
