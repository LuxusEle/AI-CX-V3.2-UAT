from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from src.db import SessionLocal
from src.models.po import PurchaseOrder
from src.schemas.po import POCreate, POOut

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("", response_model=list[POOut])
def list_pos(x_tenant_id: int = Header(...), db: Session = Depends(get_db)):
    return db.query(PurchaseOrder).filter(PurchaseOrder.tenant_id == x_tenant_id).all()

@router.post("", response_model=POOut)
def create_po(payload: POCreate, x_tenant_id: int = Header(...), db: Session = Depends(get_db)):
    po = PurchaseOrder(tenant_id=x_tenant_id, **payload.dict())
    db.add(po); db.commit(); db.refresh(po)
    return po
