"""BOM pricing service.

- Pulls BOM items for a given project_id
- Applies waste percentage
- Computes subtotal and returns suggested quote lines
- Optional margin application for selling price
"""
from sqlalchemy.orm import Session
from decimal import Decimal
from src.models.bom import BOMItem

def price_bom(db: Session, tenant_id: int, project_id: int, margin_pct: int = 25):
    items = db.query(BOMItem).filter(BOMItem.tenant_id==tenant_id, BOMItem.project_id==project_id).all()
    subtotal = Decimal(0)
    lines = []
    for it in items:
        qty = Decimal(str(it.qty))
        waste = Decimal(str(it.waste_pct or 0)) / Decimal(100)
        eff_qty = qty * (Decimal(1) + waste)
        unit_cost = Decimal(str(it.unit_cost or 0))
        line_cost = eff_qty * unit_cost
        subtotal += line_cost
        lines.append({
            "description": it.name,
            "unit_price": float(unit_cost * (Decimal(1) + Decimal(margin_pct)/Decimal(100))),
            "qty": float(eff_qty),
            "cost_basis": float(unit_cost),
            "waste_pct": float(it.waste_pct or 0),
        })
    total = float(subtotal * (Decimal(1) + Decimal(margin_pct)/Decimal(100)))
    return {"subtotal_cost": float(subtotal), "margin_pct": margin_pct, "suggested_lines": lines, "suggested_total": total}
