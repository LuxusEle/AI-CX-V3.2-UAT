from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from src.db import SessionLocal
from src.models.vendor import Vendor
from src.schemas.vendor import VendorCreate, VendorOut

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("", response_model=list[VendorOut])
def list_vendors(x_tenant_id: int = Header(...), db: Session = Depends(get_db)):
    return db.query(Vendor).filter(Vendor.tenant_id == x_tenant_id).all()

@router.post("", response_model=VendorOut)
def create_vendor(payload: VendorCreate, x_tenant_id: int = Header(...), db: Session = Depends(get_db)):
    v = Vendor(tenant_id=x_tenant_id, **payload.dict())
    db.add(v); db.commit(); db.refresh(v)
    return v
