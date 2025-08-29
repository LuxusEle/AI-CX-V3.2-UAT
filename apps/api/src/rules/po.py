"""PO rules: validate PO creation and receiving.

- totals non-negative
- vendor present
- at least one line
- per-line qty/cost sane
"""
def check_po_before_create(vendor_id: int | None, lines: list[dict]):
    if vendor_id is None:
        raise ValueError("PO: vendor_id is required")
    if not lines:
        raise ValueError("PO: must include at least one line")
    for i, l in enumerate(lines):
        if float(l.get("qty", 0)) <= 0:
            raise ValueError(f"PO line {i+1}: qty must be > 0")
        if float(l.get("unit_cost", 0)) < 0:
            raise ValueError(f"PO line {i+1}: unit_cost must be >= 0")
