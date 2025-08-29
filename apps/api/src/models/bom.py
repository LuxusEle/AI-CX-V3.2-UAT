from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey, Float, Numeric
from src.db import Base

class BOMItem(Base):
    __tablename__ = "bom_items"
    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    sku = Column(String(100))
    name = Column(String(255), nullable=False)
    qty = Column(Float, nullable=False)
    unit_cost = Column(Numeric(12,2), default=0)
    waste_pct = Column(Numeric(5,2), default=0)
    created_at = Column(DateTime, server_default=func.now())
