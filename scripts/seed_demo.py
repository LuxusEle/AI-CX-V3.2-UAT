from src.db import SessionLocal
from src.models.tenant import Tenant
from src.models.user import User
from src.services.security import hash_password

def run():
    db = SessionLocal()
    try:
        tenant = Tenant(name="Demo Co.")
        db.add(tenant); db.flush()
        admin = User(
            tenant_id=tenant.id,
            email="admin@demo.test",
            role="admin",
            hashed_password=hash_password("demo1234"),
        )
        db.add(admin); db.commit()
        print("Seeded Demo Co. and admin@demo.test / demo1234")
    finally:
        db.close()

if __name__ == "__main__":
    run()
