# Stubs for AI/RAG integration. Plug your LLM + embeddings here.
def validate_bom(project_id: int, tenant_id: int) -> dict:
    # TODO: Implement BOM checks using your rules and historical data
    return {"ok": True, "issues": []}

def estimate_cost(project_id: int, tenant_id: int, margin_pct: int = 25) -> dict:
    # TODO: Sum BOM costs, add waste, margin; return quote lines
    return {"subtotal": 0, "margin_pct": margin_pct, "lines": []}
