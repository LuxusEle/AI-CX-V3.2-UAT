from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey
from src.db import Base

class Vendor(Base):
    __tablename__ = "vendors"
    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    contact = Column(String(255))
    payment_terms = Column(String(255))
    created_at = Column(DateTime, server_default=func.now())
