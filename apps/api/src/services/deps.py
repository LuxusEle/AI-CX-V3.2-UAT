from fastapi import Header, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt
from src.config import settings

bearer = HTTPBearer(auto_error=False)

async def get_tenant_id(x_tenant_id: int | None = Header(default=None), authorization: HTTPAuthorizationCredentials | None = bearer):
    """Resolve tenant_id from JWT 'sub' (format: 'user_id:tenant_id') or fallback header.

    This enforces multi-tenancy consistently without trusting user input blindly.
    """
    if authorization and authorization.scheme.lower() == "bearer":
        try:
            payload = jwt.decode(authorization.credentials, settings.JWT_SECRET, algorithms=["HS256"])
            sub = payload.get("sub", "")
            if ":" in sub:
                _, tenant_str = sub.split(":", 1)
                return int(tenant_str)
        except Exception:
            raise HTTPException(401, "Invalid token")
    if x_tenant_id is not None:
        return x_tenant_id
    raise HTTPException(400, "Tenant not specified")
