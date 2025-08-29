from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey, Text, Numeric
from src.db import Base

class Lead(Base):
    __tablename__ = "leads"
    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255))
    phone = Column(String(50))
    status = Column(String(50), default="new") # e.g., new, qualified, proposal, won, lost
    source = Column(String(255)) # e.g., web, referral, cold_call
    value = Column(Numeric(12,2), default=0)
    notes = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())