from sqlalchemy import Column, Integer, String, DateTime, func, JSON
from src.db import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, nullable=False)
    actor_user_id = Column(Integer)
    action = Column(String(100))
    target = Column(String(100))
    payload = Column(JSON)
    created_at = Column(DateTime, server_default=func.now())
