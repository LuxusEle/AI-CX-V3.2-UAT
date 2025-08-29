from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey, Text
from src.db import Base

class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255))
    phone = Column(String(50))
    address = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
