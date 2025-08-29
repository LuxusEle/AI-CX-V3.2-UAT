# BOM & PO Rules (Business Logic)

## BOM
- Each item: name, qty > 0, waste_pct 0..50
- Effective qty = qty * (1 + waste_pct/100)
- Pricing: unit_cost from BOM or vendor catalog; selling price = unit_cost * (1 + margin)
- Validations enforced in `rules/bom.py`

## Vendor Catalog
- For auto PO split, each SKU should have at least one vendor entry with unit_cost and lead_days
- If unmapped, service raises an error (forces explicit vendor decision)

## Purchase Orders
- Each PO: vendor required, >=1 line, totals non-negative
- Lines: qty > 0; unit_cost >= 0
- Defaults: status `draft`, expected_date from vendor lead_days
