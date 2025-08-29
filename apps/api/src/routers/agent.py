from fastapi import APIRouter, Depends, Form, Request
from sqlalchemy.orm import Session
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from src.db import SessionLocal
from src.services.deps import get_tenant_id
from src.services.agent import handle_message

templates = Jinja2Templates(directory="apps/api/templates")
router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/assistant", response_class=HTMLResponse)
def assistant_page(request: Request):
    return templates.TemplateResponse("assistant.html", {"request": request})

@router.post("/assistant", response_class=HTMLResponse)
def assistant_post(request: Request, message: str = Form(...), tenant_id: int = Depends(get_tenant_id), db: Session = Depends(get_db)):
    reply = handle_message(db, tenant_id, message)
    return templates.TemplateResponse("snippets/assistant_reply.html", {"request": request, "message": message, "reply": reply})
