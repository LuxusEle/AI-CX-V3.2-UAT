from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey, Numeric, Date
from src.db import Base

class Quote(Base):
    """Represents a customer quote or estimate.

    Data source: created via API from UI form inputs (client, items, notes).
    Data sinks: used by PDF generator; totals posted to transactions later if accepted.
    """
    __tablename__ = "quotes"
    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"))
    client_id = Column(Integer, ForeignKey("clients.id"))
    number = Column(String(50), unique=True)  # e.g., QT-000081
    issue_date = Column(Date)
    due_date = Column(Date)
    currency = Column(String(10), default="LKR")
    subtotal = Column(Numeric(12,2), default=0)
    total = Column(Numeric(12,2), default=0)
    notes = Column(String(2000))
    created_at = Column(DateTime, server_default=func.now())

class QuoteLine(Base):
    """Line items for a quote.

    Data source: UI sends line array, each mapped to this table.
    Data sinks: summed into Quote.subtotal/total by service layer.
    """
    __tablename__ = "quote_lines"
    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    quote_id = Column(Integer, ForeignKey("quotes.id", ondelete="CASCADE"), nullable=False)
    description = Column(String(1000), nullable=False)
    unit_price = Column(Numeric(12,2), default=0)
    qty = Column(Numeric(12,2), default=1)
    line_total = Column(Numeric(12,2), default=0)
