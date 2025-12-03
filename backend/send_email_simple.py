from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import base64

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://agentic-automation-workflow-builder-orpln.vercel.app",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FileAttachment(BaseModel):
    filename: str
    content: str  # base64 encoded
    content_type: str

class EmailRequest(BaseModel):
    to: str
    subject: str
    body: str
    attachments: Optional[List[FileAttachment]] = None

@app.post("/api/send-email")
async def send_email(email: EmailRequest):
    # Log the email for debugging
    print("\n" + "="*60)
    print("📧 EMAIL NOTIFICATION")
    print("="*60)
    print(f"To: {email.to}")
    print(f"Subject: {email.subject}")
    print(f"Body:\n{email.body}")
    if email.attachments:
        print(f"Attachments: {len(email.attachments)} file(s)")
        for att in email.attachments:
            print(f"  - {att.filename} ({att.content_type})")
    print("="*60 + "\n")
    
    # Actually send the email via Gmail
    try:
        smtp_user = "yadavanushka759@gmail.com"
        smtp_pass = "lkjcpnqvgggbgnbl"
        smtp_host = "smtp.gmail.com"
        
        print(f"Connecting to Gmail SMTP...")
        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = email.to
        msg['Subject'] = email.subject
        
        # Attach body
        msg.attach(MIMEText(email.body, 'plain'))
        
        # Attach files if any
        if email.attachments:
            for attachment in email.attachments:
                try:
                    # Decode base64 content
                    file_data = base64.b64decode(attachment.content)
                    
                    # Create attachment
                    part = MIMEBase('application', 'octet-stream')
                    part.set_payload(file_data)
                    encoders.encode_base64(part)
                    part.add_header(
                        'Content-Disposition',
                        f'attachment; filename= {attachment.filename}'
                    )
                    msg.attach(part)
                    print(f"  ✅ Attached: {attachment.filename}")
                except Exception as e:
                    print(f"  ❌ Failed to attach {attachment.filename}: {e}")

        # Try SSL first (port 465)
        try:
            print(f"Attempting SSL connection on port 465...")
            server = smtplib.SMTP_SSL(smtp_host, 465, timeout=10)
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
            server.quit()
            print(f"✅ Email sent successfully via SSL to {email.to}")
            return {"success": True, "message": f"Email sent to {email.to}"}
        except Exception as ssl_error:
            print(f"SSL failed: {ssl_error}, trying TLS...")
            # Fallback to TLS (port 587)
            server = smtplib.SMTP(smtp_host, 587, timeout=10)
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
            server.quit()
            print(f"✅ Email sent successfully via TLS to {email.to}")
            return {"success": True, "message": f"Email sent to {email.to}"}
        
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Failed to send email: {error_msg}")
        return {"success": False, "error": error_msg}

@app.get("/")
def root():
    return {"message": "Email service running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
