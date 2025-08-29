from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class LeadBase(BaseModel):
    client_id: Optional[int] = None
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    status: str = "new"
    source: Optional[str] = None
    value: float = 0.0
    notes: Optional[str] = None

class LeadCreate(LeadBase):
    pass

class LeadUpdate(LeadBase):
    pass

class LeadInDB(LeadBase):
    id: int
    tenant_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True