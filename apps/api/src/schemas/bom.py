from pydantic import BaseModel
from typing import Optional

class BOMItemCreate(BaseModel):
    project_id: int
    sku: Optional[str] = None
    name: str
    qty: float
    unit_cost: float = 0
    waste_pct: float = 0

class BOMItemOut(BaseModel):
    id: int
    project_id: int
    sku: str | None
    name: str
    qty: float
    unit_cost: float
    waste_pct: float
    class Config:
        from_attributes = True
