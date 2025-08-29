from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey, Date
from src.db import Base

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    client_id = Column(Integer, ForeignKey("clients.id"))
    name = Column(String(255), nullable=False)
    status = Column(String(50), default="draft")
    start_date = Column(Date)
    end_date = Column(Date)
    created_at = Column(DateTime, server_default=func.now())
