from fastapi import APIRouter, Request, Depends, Form, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from src.db import SessionLocal
from src.models.user import User
from src.services.rbac import require_role

templates = Jinja2Templates(directory="apps/api/templates")
router = APIRouter()

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@router.get("/admin/users", response_class=HTMLResponse)
def users_page(request: Request, db: Session = Depends(get_db), user=Depends(require_role("admin"))):
    users = db.query(User).filter(User.tenant_id == user.tenant_id).all()
    return templates.TemplateResponse("admin_users.html", {"request": request, "users": users})

@router.post("/admin/users/role", response_class=HTMLResponse)
def change_role(request: Request, user_id: int = Form(...), role: str = Form(...), db: Session = Depends(get_db), user=Depends(require_role("admin"))):
    target = db.query(User).filter(User.id == user_id, User.tenant_id == user.tenant_id).first()
    if not target: raise HTTPException(404, "User not found")
    target.role = role
    db.commit()
    return RedirectResponse(url="/admin/users", status_code=303)
