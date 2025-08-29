from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from src.db import get_db
from src.models.lead import Lead
from src.models.project import Project
from src.schemas.lead import LeadCreate, LeadUpdate, LeadInDB
from src.services.deps import get_current_tenant_id

router = APIRouter()

@router.post("/leads", response_model=LeadInDB, status_code=status.HTTP_201_CREATED)
def create_lead(
    lead: LeadCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    db_lead = Lead(**lead.model_dump(), tenant_id=tenant_id)
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead

@router.get("/leads", response_model=List[LeadInDB])
def read_leads(
    status: Optional[str] = None,
    client_id: Optional[int] = None,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    query = db.query(Lead).filter(Lead.tenant_id == tenant_id)
    if status:
        query = query.filter(Lead.status == status)
    if client_id:
        query = query.filter(Lead.client_id == client_id)
    return query.all()

@router.get("/leads/{lead_id}", response_model=LeadInDB)
def read_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    db_lead = db.query(Lead).filter(Lead.id == lead_id, Lead.tenant_id == tenant_id).first()
    if db_lead is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    return db_lead

@router.put("/leads/{lead_id}", response_model=LeadInDB)
def update_lead(
    lead_id: int,
    lead: LeadUpdate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    db_lead = db.query(Lead).filter(Lead.id == lead_id, Lead.tenant_id == tenant_id).first()
    if db_lead is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    for key, value in lead.model_dump(exclude_unset=True).items():
        setattr(db_lead, key, value)
    db.commit()
    db.refresh(db_lead)
    return db_lead

@router.delete("/leads/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    db_lead = db.query(Lead).filter(Lead.id == lead_id, Lead.tenant_id == tenant_id).first()
    if db_lead is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    db.delete(db_lead)
    db.commit()
    return

@router.post("/leads/{lead_id}/win", response_model=LeadInDB)
def win_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    db_lead = db.query(Lead).filter(Lead.id == lead_id, Lead.tenant_id == tenant_id).first()
    if db_lead is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    
    if db_lead.status == "won":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Lead is already won")

    # Update lead status
    db_lead.status = "won"
    db.add(db_lead)
    db.flush() # Flush to get the updated lead before creating project

    # Create a new project based on the lead
    new_project = Project(
        tenant_id=tenant_id,
        client_id=db_lead.client_id,
        name=f"Project from Lead: {db_lead.name}",
        status="active", # Or "pending", depending on desired initial state
        # You might want to copy other relevant lead details to the project
    )
    db.add(new_project)
    db.commit()
    db.refresh(db_lead)
    return db_lead