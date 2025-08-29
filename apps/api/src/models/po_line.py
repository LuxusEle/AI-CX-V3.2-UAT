from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey, Numeric, Date
from src.db import Base

class PurchaseOrderLine(Base):
    """Line items for purchase orders.
    Source: created by PO split service from BOM or manual entry.
    Sink: drives receiving and cost reconciliation.
    """
    __tablename__ = "purchase_order_lines"
    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    po_id = Column(Integer, ForeignKey("purchase_orders.id", ondelete="CASCADE"), nullable=False)
    sku = Column(String(100))
    description = Column(String(255))
    qty = Column(Numeric(12,2), default=0)
    unit_cost = Column(Numeric(12,2), default=0)
    line_total = Column(Numeric(12,2), default=0)
    expected_date = Column(Date, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
