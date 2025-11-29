from app.utils.email_service import send_email
from app.config import ADMIN_EMAIL

def send_alert(message):
    subject = "Agentic Workflow Alert"
    send_email(ADMIN_EMAIL, subject, message)
