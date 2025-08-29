from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from src.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)

def create_token(sub: str, minutes: int, secret: str):
    exp = datetime.utcnow() + timedelta(minutes=minutes)
    to_encode = {"sub": sub, "exp": exp}
    return jwt.encode(to_encode, secret, algorithm="HS256")

def create_access_token(sub: str):
    return create_token(sub, settings.JWT_EXPIRE_MIN, settings.JWT_SECRET)

def create_refresh_token(sub: str):
    return create_token(sub, settings.JWT_REFRESH_EXPIRE_MIN, settings.JWT_REFRESH_SECRET)
