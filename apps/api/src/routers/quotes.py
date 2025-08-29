from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from src.db import SessionLocal
from src.schemas.quote import QuoteCreate, QuoteOut
from src.models.quote import Quote, QuoteLine
from src.rules.quotes import check_lines_present, check_totals_consistency
from src.services.pdf import render_quote_pdf
from fastapi.responses import StreamingResponse
from io import BytesIO
from datetime import date

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("", response_model=QuoteOut)
def create_quote(payload: QuoteCreate, x_tenant_id: int = Header(...), db: Session = Depends(get_db)):
    """Create a Quote with line items.

    Pulls data from: payload JSON from the UI.
    Writes data to: quotes, quote_lines tables.
    Calculations: line_total = unit_price * qty; subtotal = sum(line_total); total = subtotal (taxes/discounts TBD).
    """
    lines = [l.dict() for l in payload.lines]
    check_lines_present(lines)

    # Compute totals
    subtotal = sum(float(l["unit_price"]) * float(l["qty"]) for l in lines)
    total = subtotal
    check_totals_consistency(subtotal, total)

    q = Quote(
        tenant_id=x_tenant_id,
        project_id=payload.project_id,
        client_id=payload.client_id,
        number=payload.number or "QT-" + str(int(date.today().strftime("%y%m%d%H%M"))),
        issue_date=payload.issue_date or date.today(),
        due_date=payload.due_date or date.today(),
        currency=payload.currency,
        subtotal=subtotal,
        total=total,
        notes=payload.notes or ""
    )
    db.add(q); db.flush()
    for l in lines:
        db.add(QuoteLine(
            tenant_id=x_tenant_id,
            quote_id=q.id,
            description=l["description"],
            unit_price=l["unit_price"],
            qty=l["qty"],
            line_total=float(l["unit_price"]) * float(l["qty"]),
        ))
    db.commit(); db.refresh(q)
    return q

@router.get("/{quote_id}/pdf")
def quote_pdf(quote_id: int, x_tenant_id: int = Header(...), db: Session = Depends(get_db)):
    """Generate a PDF for the quote.

    Pulls data from: quotes + quote_lines + (placeholder) company + bank + terms.
    Sends data to: HTTP response (download) and may be stored later to S3 (not implemented).
    Logic: Pages include summary, items, totals, bank, and a Terms page.
    """
    q = db.query(Quote).filter(Quote.id==quote_id, Quote.tenant_id==x_tenant_id).first()
    if not q: raise HTTPException(404, "Quote not found")
    lines = db.query(QuoteLine).filter(QuoteLine.quote_id==q.id, QuoteLine.tenant_id==x_tenant_id).all()
    if not lines: raise HTTPException(400, "No lines on this quote")

    company = {"name":"Your Brand", "address":"Address line", "phone":"+94 77 000 0000", "email":"ops@brand.test"}
    customer = {"name":"Customer", "address":"", "city":"", "country":"Sri Lanka"}
    bank = {"title":"BANK DETAILS", "lines":[
        "INFINITY KITCHEN DESIGNERS (PVT) LTD",
        "BANK NAME - SEYLAN BANK",
        "ACCOUNT NUMBER - 021 013 279 542 001"
    ]}
    terms = [
        "Advance required before production; non-refundable after start.",
        "Production starts after signed document and clarifications.",
        "30 days allocated for production after final clarifications.",
        "Customer must provide uninterrupted site access.",
        "Changes during production incur extra charges.",
        "Full payment for accessories before production.",
        "Production completes upon full payment.",
        "Assembly charged per linear foot if done by us.",
        "Pricing excludes non-cabinet costs unless specified.",
        "Accessories to be provided before production unless specified.",
        "Tops to be provided by customer unless specified.",
        "Electrical/plumbing/ventilation and power lines to be handled by customer unless specified."
    ]

    quote_dict = {
        "number": q.number, "issue_date": str(q.issue_date), "due_date": str(q.due_date),
        "currency": q.currency, "subtotal": float(q.subtotal), "total": float(q.total)
    }
    line_dicts = [{
        "description": l.description, "unit_price": float(l.unit_price), "qty": float(l.qty)
    } for l in lines]

    pdf_bytes = render_quote_pdf(company, customer, quote_dict, line_dicts, bank, terms)
    return StreamingResponse(BytesIO(pdf_bytes), media_type="application/pdf",
                             headers={"Content-Disposition": f"inline; filename=quote_{q.number}.pdf"})
