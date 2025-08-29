"""'Sam' agent service: intent parsing + tool calls.

This is a safe, deterministic stub that you can later replace with an LLM.
Supported intents (examples):
- 'update CRM stage to visit' -> updates a project/client status
- 'start site visit'          -> placeholder to log timestamp / future GPS
- 'price the project X'       -> calls BOM pricing
- 'split POs for project X'   -> calls PO split service
"""
import re
from sqlalchemy.orm import Session
from src.models.project import Project
from src.services.bom_service import price_bom
from src.services.po_service import split_bom_into_pos

def handle_message(db: Session, tenant_id: int, text: str) -> str:
    t = text.lower().strip()

    # update CRM stage
    m = re.search(r"update (crm|stage).*(visit|site visit)", t)
    if m:
        proj = db.query(Project).filter(Project.tenant_id==tenant_id).order_by(Project.id.desc()).first()
        if not proj: return "I couldn't find any project to update."
        proj.status = "visit"; db.commit()
        return f"Updated project '{proj.name}' to stage: VISIT."

    # price project
    m = re.search(r"price (the )?project (\d+)", t)
    if m:
        pid = int(m.group(2))
        res = price_bom(db, tenant_id, pid, margin_pct=25)
        return f"Estimated total {res['suggested_total']:.2f} with margin {res['margin_pct']}%."

    # split POs
    m = re.search(r"(split|create).*(po|purchase orders).*(project )?(\d+)", t)
    if m:
        pid = int(m.group(4))
        ids = split_bom_into_pos(db, tenant_id, pid)
        return f"Created {len(ids)} POs: {', '.join(map(str, ids))}."

    # start visit
    if "start visit" in t or "going to visit" in t:
        return "Okay, I marked the start of your site visit. When you arrive, tell me 'I'm here' and I'll prepare photo capture."

    return "Sorry, I didn't understand. You can say 'update CRM stage to visit', 'price the project 12', or 'split POs for project 12'."
