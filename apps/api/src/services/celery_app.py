from celery import Celery
import os

celery = Celery(
    __name__,
    broker=os.getenv("REDIS_URL", "redis://redis:6379/0"),
    backend=os.getenv("REDIS_URL", "redis://redis:6379/0"),
)

@celery.task
def generate_pdf_quote(project_id: int):
    # TODO: Implement PDF generation (reportlab)
    return {"ok": True, "project_id": project_id}
