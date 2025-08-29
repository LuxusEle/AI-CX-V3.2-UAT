from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import EmailStr
from src.db import SessionLocal
from src.models.user import User
from src.models.tenant import Tenant
from src.schemas.auth import RegisterRequest, LoginRequest, TokenPair
from src.services.security import hash_password, verify_password, create_access_token, create_refresh_token

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=TokenPair)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    tenant = Tenant(name=data.tenant_name)
    db.add(tenant); db.flush()
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(400, "Email already registered")
    user = User(tenant_id=tenant.id, email=data.email, hashed_password=hash_password(data.password), role="admin")
    db.add(user); db.commit()
    sub = f"{user.id}:{tenant.id}"
    return TokenPair(access_token=create_access_token(sub), refresh_token=create_refresh_token(sub))

@router.post("/login", response_model=TokenPair)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(401, "Invalid credentials")
    sub = f"{user.id}:{user.tenant_id}"
    return TokenPair(access_token=create_access_token(sub), refresh_token=create_refresh_token(sub))
