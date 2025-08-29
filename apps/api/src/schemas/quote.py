from pydantic import BaseModel, condecimal
from typing import List, Optional
from datetime import date

class QuoteLineIn(BaseModel):
    description: str
    unit_price: condecimal(max_digits=12, decimal_places=2)
    qty: condecimal(max_digits=12, decimal_places=2) = 1

class QuoteCreate(BaseModel):
    project_id: Optional[int] = None
    client_id: Optional[int] = None
    number: Optional[str] = None
    issue_date: Optional[date] = None
    due_date: Optional[date] = None
    currency: str = "LKR"
    notes: Optional[str] = None
    lines: List[QuoteLineIn]

class QuoteOut(BaseModel):
    id: int
    number: Optional[str] = None
    subtotal: float
    total: float
    currency: str
    class Config:
        from_attributes = True
