"""BOM rules: validate items before costing or PO split.

Checks cover:
- required fields
- non-negative quantities/costs
- reasonable waste percentage
- vendor availability if auto-splitting to POs
"""
def check_bom_item(item: dict, idx: int):
    if not item.get("name"):
        raise ValueError(f"BOM item {idx}: name required")
    if item.get("qty") is None or float(item["qty"]) <= 0:
        raise ValueError(f"BOM item {idx}: qty must be > 0")
    if float(item.get("waste_pct", 0)) < 0 or float(item.get("waste_pct", 0)) > 50:
        raise ValueError(f"BOM item {idx}: waste_pct must be between 0 and 50")

def check_vendor_mapping(mapped_vendor_id: int | None, idx: int):
    if mapped_vendor_id is None:
        # Prefer raising to force explicit decisions
        raise ValueError(f"BOM item {idx}: no vendor mapping found; please select a vendor or add catalog entry")
