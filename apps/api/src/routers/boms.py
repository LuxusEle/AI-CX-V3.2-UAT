from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from src.db import SessionLocal
from src.models.bom import BOMItem
from src.schemas.bom import BOMItemCreate, BOMItemOut

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("", response_model=list[BOMItemOut])
def list_bom_items(project_id: int, x_tenant_id: int = Header(...), db: Session = Depends(get_db)):
    return db.query(BOMItem).filter(BOMItem.tenant_id == x_tenant_id, BOMItem.project_id == project_id).all()

@router.post("", response_model=BOMItemOut)
def add_bom_item(payload: BOMItemCreate, x_tenant_id: int = Header(...), db: Session = Depends(get_db)):
    b = BOMItem(tenant_id=x_tenant_id, **payload.dict())
    db.add(b); db.commit(); db.refresh(b)
    return b
