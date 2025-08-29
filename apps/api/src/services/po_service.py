"""PO splitting service.

- Reads BOM items for a project
- Looks up preferred vendor per SKU in VendorCatalog
- Groups lines by vendor and creates POs + PO lines
- Returns created PO ids
"""
from sqlalchemy.orm import Session
from decimal import Decimal
from datetime import date, timedelta
from src.models.bom import BOMItem
from src.models.vendor_catalog import VendorCatalog
from src.models.po import PurchaseOrder
from src.models.po_line import PurchaseOrderLine
from src.rules.bom import check_vendor_mapping
from src.rules.po import check_po_before_create

def split_bom_into_pos(db: Session, tenant_id: int, project_id: int) -> list[int]:
    items = db.query(BOMItem).filter(BOMItem.tenant_id==tenant_id, BOMItem.project_id==project_id).all()
    by_vendor: dict[int, list[dict]] = {}
    for idx, it in enumerate(items, start=1):
        mapping = db.query(VendorCatalog).filter(
            VendorCatalog.tenant_id==tenant_id,
            VendorCatalog.sku==it.sku
        ).order_by(VendorCatalog.unit_cost.asc()).first()
        vendor_id = mapping.vendor_id if mapping else None
        check_vendor_mapping(vendor_id, idx)

        qty = Decimal(str(it.qty))
        waste = Decimal(str(it.waste_pct or 0)) / Decimal(100)
        eff_qty = qty * (Decimal(1) + waste)
        unit_cost = Decimal(str(mapping.unit_cost if mapping else it.unit_cost or 0))
        line_total = eff_qty * unit_cost
        expected_date = date.today() + timedelta(days=int(mapping.lead_days if mapping else 7))

        by_vendor.setdefault(vendor_id, []).append({
            "sku": it.sku, "description": it.name, "qty": float(eff_qty),
            "unit_cost": float(unit_cost), "line_total": float(line_total),
            "expected_date": expected_date
        })

    created_po_ids: list[int] = []
    for vendor_id, lines in by_vendor.items():
        check_po_before_create(vendor_id, lines)
        total = sum(l["line_total"] for l in lines)
        po = PurchaseOrder(tenant_id=tenant_id, vendor_id=vendor_id, project_id=project_id, status="draft", total=total)
        db.add(po); db.flush()
        for l in lines:
            db.add(PurchaseOrderLine(
                tenant_id=tenant_id, po_id=po.id, sku=l["sku"], description=l["description"],
                qty=l["qty"], unit_cost=l["unit_cost"], line_total=l["line_total"], expected_date=l["expected_date"]
            ))
        created_po_ids.append(po.id)
    db.commit()
    return created_po_ids
