from celery import Celery
from app.config import REDIS_URL

celery = Celery("agentic", broker=REDIS_URL, backend=REDIS_URL)

# Optionally, you can configure beat schedule here or dynamically add schedules
celery.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    beat_schedule={}
)
