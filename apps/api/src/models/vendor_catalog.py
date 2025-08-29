from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey, Numeric
from src.db import Base

class VendorCatalog(Base):
    """Maps SKUs to vendors with pricing and lead-time.
    Source: seeded or uploaded catalog CSV per vendor.
    Sink: used by BOM → PO split to choose vendor and unit_cost.
    """
    __tablename__ = "vendor_catalog"
    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=False)
    sku = Column(String(100), nullable=False)
    description = Column(String(255))
    uom = Column(String(20), default="unit")
    unit_cost = Column(Numeric(12,2), default=0)
    currency = Column(String(10), default="LKR")
    lead_days = Column(Integer, default=7)
    min_order_qty = Column(Numeric(12,2), default=0)
    created_at = Column(DateTime, server_default=func.now())
