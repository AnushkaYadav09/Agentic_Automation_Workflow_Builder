FROM python:3.11-slim

WORKDIR /app

# Install only the dependencies we need for the email service
RUN pip install --no-cache-dir fastapi uvicorn[standard] pydantic python-multipart

# Copy only the email service file
COPY send_email_simple.py .

EXPOSE 8001

CMD ["python", "send_email_simple.py"]
