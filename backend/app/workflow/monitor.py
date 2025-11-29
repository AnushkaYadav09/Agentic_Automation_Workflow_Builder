from app.workflow.alerter import send_alert
from app.utils.email_service import send_email
from app.config import ADMIN_EMAIL

class MonitorAgent:
    def check(self, result, task_info=None):
        if result.get("status") != "success":
            message = f"Task failed: {result}. Task info: {task_info}"
            send_alert(message)
        else:
            # Optionally write a success log
            pass

monitor_agent = MonitorAgent()
