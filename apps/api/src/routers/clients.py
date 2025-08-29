from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from src.db import SessionLocal
from src.models.client import Client
from src.schemas.client import ClientCreate, ClientOut

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("", response_model=list[ClientOut])
def list_clients(x_tenant_id: int = Header(...), db: Session = Depends(get_db)):
    return db.query(Client).filter(Client.tenant_id == x_tenant_id).all()

@router.post("", response_model=ClientOut)
def create_client(payload: ClientCreate, x_tenant_id: int = Header(...), db: Session = Depends(get_db)):
    c = Client(tenant_id=x_tenant_id, **payload.dict())
    db.add(c); db.commit(); db.refresh(c)
    return c
