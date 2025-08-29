from fastapi import APIRouter, Request, Depends, Header, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from src.db import SessionLocal
from src.models.client import Client
from src.models.quote import Quote, QuoteLine
from datetime import date

templates = Jinja2Templates(directory="apps/api/templates")
router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_class=HTMLResponse)
def dashboard(request: Request):
    return templates.TemplateResponse("dashboard.html", {"request": request, "status": "ok"})

@router.get("/clients", response_class=HTMLResponse)
def clients_page(request: Request, x_tenant_id: int = Header(default=1), db: Session = Depends(get_db)):
    clients = db.query(Client).filter(Client.tenant_id == x_tenant_id).all()
    return templates.TemplateResponse("clients.html", {"request": request, "clients": clients})

@router.post("/clients", response_class=HTMLResponse)
def clients_create(request: Request, name: str = Form(...), email: str = Form(""), x_tenant_id: int = Header(default=1), db: Session = Depends(get_db)):
    c = Client(tenant_id=x_tenant_id, name=name, email=email or None)
    db.add(c); db.commit()
    return RedirectResponse(url="/clients", status_code=303)

@router.get("/quotes", response_class=HTMLResponse)
def quotes_page(request: Request, x_tenant_id: int = Header(default=1), db: Session = Depends(get_db)):
    quotes = db.query(Quote).filter(Quote.tenant_id == x_tenant_id).order_by(Quote.id.desc()).limit(50).all()
    return templates.TemplateResponse("quotes.html", {"request": request, "quotes": quotes})

@router.post("/quotes", response_class=HTMLResponse)
def quotes_create_htmx(
    request: Request,
    description: str = Form(...),
    unit_price: float = Form(...),
    qty: float = Form(...),
    x_tenant_id: int = Header(default=1),
    db: Session = Depends(get_db)
):
    # minimal create (single line) for demo
    q = Quote(
        tenant_id=x_tenant_id,
        number="QT-" + date.today().strftime("%y%m%d%H%M%S"),
        issue_date=date.today(),
        due_date=date.today(),
        currency="LKR",
        subtotal=unit_price * qty,
        total=unit_price * qty,
        notes="",
    )
    db.add(q); db.flush()
    db.add(QuoteLine(
        tenant_id=x_tenant_id,
        quote_id=q.id,
        description=description,
        unit_price=unit_price,
        qty=qty,
        line_total=unit_price*qty
    ))
    db.commit(); db.refresh(q)
    return templates.TemplateResponse("snippets/quote_item.html", {"request": request, "q": q})
