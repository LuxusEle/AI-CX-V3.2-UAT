from src.db import SessionLocal
from src.models.tenant import Tenant
from src.models.user import User
from src.models.client import Client
from src.models.project import Project
from src.models.vendor import Vendor
from src.models.vendor_catalog import VendorCatalog
from src.models.bom import BOMItem
from src.services.security import hash_password

def run():
    db = SessionLocal()
    try:
        tenant = Tenant(name="Demo Co.")
        db.add(tenant); db.flush()
        admin = User(tenant_id=tenant.id, email="admin@demo.test", role="admin", hashed_password=hash_password("demo1234"))
        db.add(admin)

        client = Client(tenant_id=tenant.id, name="Mr. Jones", email="jones@example.com")
        db.add(client); db.flush()
        proj = Project(tenant_id=tenant.id, client_id=client.id, name="Kitchen Renovation", status="lead")
        db.add(proj); db.flush()

        v1 = Vendor(tenant_id=tenant.id, name="Alpha Panels", contact="alpha@example.com", payment_terms="30D")
        v2 = Vendor(tenant_id=tenant.id, name="Bravo Hardware", contact="bravo@example.com", payment_terms="30D")
        db.add_all([v1, v2]); db.flush()

        db.add_all([
            VendorCatalog(tenant_id=tenant.id, vendor_id=v1.id, sku="PLY18", description="18mm Plywood Sheet", unit_cost=15000, currency="LKR", lead_days=5),
            VendorCatalog(tenant_id=tenant.id, vendor_id=v2.id, sku="HINGE90", description="90° Hinge", unit_cost=450, currency="LKR", lead_days=3),
        ])

        db.add_all([
            BOMItem(tenant_id=tenant.id, project_id=proj.id, sku="PLY18", name="Plywood 18mm", qty=12, unit_cost=0, waste_pct=10),
            BOMItem(tenant_id=tenant.id, project_id=proj.id, sku="HINGE90", name="Hinge 90°", qty=40, unit_cost=0, waste_pct=5),
        ])

        db.commit()
        print("Seeded demo: tenant=1, admin=admin@demo.test, project with BOM and vendor catalog")
    finally:
        db.close()

if __name__ == "__main__":
    run()


        # additional non-admin user
        user = User(tenant_id=tenant.id, email="user@demo.test", role="user", hashed_password=hash_password("demo1234"))
        db.add(user)
