from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey, Numeric
from src.db import Base

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"
    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    vendor_id = Column(Integer, ForeignKey("vendors.id"))
    project_id = Column(Integer, ForeignKey("projects.id"))
    status = Column(String(50), default="draft")
    total = Column(Numeric(12,2), default=0)
    created_at = Column(DateTime, server_default=func.now())
