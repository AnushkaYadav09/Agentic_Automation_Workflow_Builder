import requests
import time

API_URL = "http://localhost:8000"

def test_email_workflow():
    # 0. Check Connectivity
    try:
        resp = requests.get(f"{API_URL}/")
        print(f"Root endpoint status: {resp.status_code}, Response: {resp.text}")
    except Exception as e:
        print(f"Could not connect to API: {e}")
        return

    # 1. Create a Workflow
    workflow_data = {
        "name": "Test Email Workflow",
        "definition": {
            "steps": [
                {
                    "type": "email",
                    "to": "yadavanushka759@gmail.com",  # Using the admin email from .env as recipient for testing
                    "subject": "Test Email from Agentic Workflow",
                    "body": "Hello! If you are reading this, the Agentic Workflow is working correctly."
                }
            ]
        }
    }
    
    print("Creating workflow...")
    response = requests.post(f"{API_URL}/workflows/", json=workflow_data)
    if response.status_code != 200:
        print(f"Failed to create workflow. Status: {response.status_code}")
        print(f"Response: {response.text}")
        return
    
    workflow = response.json()
    workflow_id = workflow["id"]
    print(f"Workflow created with ID: {workflow_id}")
    
    # 2. Execute the Workflow
    print("Executing workflow...")
    response = requests.post(f"{API_URL}/workflows/{workflow_id}/execute")
    if response.status_code != 200:
        print(f"Failed to execute workflow: {response.text}")
        return
    
    result = response.json()
    print(f"Execution started. Tasks enqueued: {result}")
    
    print("\nCheck your email (yadavanushka759@gmail.com) to see if it arrived!")
    print("Also check the Celery terminal for logs.")

if __name__ == "__main__":
    test_email_workflow()
