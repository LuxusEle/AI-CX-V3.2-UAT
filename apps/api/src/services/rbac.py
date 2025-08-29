from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from jose import jwt
from src.config import settings
from src.db import SessionLocal
from src.models.user import User

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

def current_user(credentials: str, db: Session):
    try:
        payload = jwt.decode(credentials, settings.JWT_SECRET, algorithms=["HS256"])
        sub = payload.get("sub", "")
        user_id = int(sub.split(":")[0]) if ":" in sub else int(sub)
        user = db.query(User).filter(User.id == user_id).first()
        if not user: raise HTTPException(401, "User not found")
        return user
    except Exception:
        raise HTTPException(401, "Invalid token")

def require_role(*allowed):
    def checker(user: User = Depends(lambda credentials, db=Depends(get_db): current_user(credentials, db))):
        if user.role not in allowed:
            raise HTTPException(403, "Insufficient permissions")
        return user
    return checker
