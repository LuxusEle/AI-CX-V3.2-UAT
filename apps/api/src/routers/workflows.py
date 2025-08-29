from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.db import SessionLocal
from src.services.deps import get_tenant_id
from src.services.bom_service import price_bom
from src.services.po_service import split_bom_into_pos

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/projects/{project_id}/bom/price")
def price_project_bom(project_id: int, tenant_id: int = Depends(get_tenant_id), db: Session = Depends(get_db)):
    """Price a project's BOM with margin.

    Pulls: BOM items (DB)
    Sends: JSON with subtotal_cost, suggested_lines (for quote), suggested_total
    """
    return price_bom(db, tenant_id, project_id, margin_pct=25)

@router.post("/projects/{project_id}/bom/split-pos")
def create_pos_from_bom(project_id: int, tenant_id: int = Depends(get_tenant_id), db: Session = Depends(get_db)):
    """Create POs from a project's BOM by vendor mapping.

    Pulls: BOM items, VendorCatalog (DB)
    Writes: PurchaseOrders + PurchaseOrderLines
    Returns: created PO ids
    """
    ids = split_bom_into_pos(db, tenant_id, project_id)
    return {"created_po_ids": ids}
