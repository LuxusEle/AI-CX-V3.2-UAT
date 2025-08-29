from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from src.db import SessionLocal
from src.models.project import Project
from src.schemas.project import ProjectCreate, ProjectOut

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("", response_model=list[ProjectOut])
def list_projects(x_tenant_id: int = Header(...), db: Session = Depends(get_db)):
    return db.query(Project).filter(Project.tenant_id == x_tenant_id).all()

@router.post("", response_model=ProjectOut)
def create_project(payload: ProjectCreate, x_tenant_id: int = Header(...), db: Session = Depends(get_db)):
    p = Project(tenant_id=x_tenant_id, **payload.dict())
    db.add(p); db.commit(); db.refresh(p)
    return p
