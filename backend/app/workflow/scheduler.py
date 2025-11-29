from app.celery_app import celery
from celery.schedules import crontab
import json
from app.workflow.executor import execute_task

def schedule_weekly_report(workflow_id, weekday=1, hour=10, payload=None):
    """
    weekday: 0-6 (mon=0)
    schedule a named periodic task in celery beat config
    """
    name = f"weekly_report_{workflow_id}"
    # schedule using crontab — run at hour:00 every week day
    celery.conf.beat_schedule[name] = {
        "task": "execute_task",
        "schedule": crontab(hour=hour, minute=0, day_of_week=weekday),
        "args": (payload,)
    }
    celery.control.broadcast('heartbeat')
