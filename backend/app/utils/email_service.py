import smtplib
from email.mime.text import MIMEText
from app.config import SMTP_USER, SMTP_PASS, SMTP_HOST, SMTP_PORT

def send_email(to, subject, body):
    print(f"DEBUG: Preparing to send email to {to}")
    print(f"DEBUG: SMTP Config - Host: {SMTP_HOST}, Port: {SMTP_PORT}, User: {SMTP_USER}")
    try:
        msg = MIMEText(body)
        msg["From"] = SMTP_USER
        msg["To"] = to
        msg["Subject"] = subject
        
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
            print("DEBUG: Connecting to SMTP server...")
            server.login(SMTP_USER, SMTP_PASS)
            print("DEBUG: Logged in. Sending mail...")
            server.sendmail(SMTP_USER, [to], msg.as_string())
            print("DEBUG: Email sent successfully via SMTP.")
    except Exception as e:
        print(f"DEBUG: ERROR sending email: {e}")
        raise e
