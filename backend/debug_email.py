import smtplib
from email.mime.text import MIMEText
from app.config import SMTP_USER, SMTP_PASS, SMTP_HOST, SMTP_PORT

def debug_email():
    to = "06kanishkaa@gmail.com"
    subject = "Debug Email Test"
    body = "This is a debug email to verify SMTP settings and delivery."
    
    print(f"Attempting to send email to: {to}")
    print(f"SMTP Host: {SMTP_HOST}")
    print(f"SMTP Port: {SMTP_PORT}")
    print(f"SMTP User: {SMTP_USER}")
    
    msg = MIMEText(body)
    msg["From"] = SMTP_USER
    msg["To"] = to
    msg["Subject"] = subject
    
    try:
        print("Connecting to SMTP server...")
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
            server.set_debuglevel(1)  # Enable verbose debug output
            print("Logging in...")
            server.login(SMTP_USER, SMTP_PASS)
            print("Sending mail...")
            server.sendmail(SMTP_USER, [to], msg.as_string())
            print("Email sent successfully according to SMTP server.")
    except Exception as e:
        print(f"FAILED to send email: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_email()
