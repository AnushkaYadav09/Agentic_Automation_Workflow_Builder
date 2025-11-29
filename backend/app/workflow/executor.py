from app.celery_app import celery
from app.utils.email_service import send_email
from app.workflow.monitor import monitor_agent

@celery.task(bind=True, name="execute_task")
def execute_task(self, task_info):
    """
    Background Task: Executes a single workflow step.
    
    This function runs asynchronously via Celery. It handles different task types
    (e.g., sending emails, scheduling meetings) and reports the status.

    Args:
        task_info (dict): Contains 'type' (email/meet) and 'payload' (data).
    
    Returns:
        dict: Status of the execution ("success" or "failed").
    """
    try:
        if task_info["type"] == "email":
            # Extract email details
            to = task_info["payload"]["to"]
            subject = task_info["payload"]["subject"]
            body = task_info["payload"]["body"]
            
            # Send the email using utility function
            send_email(to, subject, body)
            
        elif task_info["type"] == "meet":
            # Handle Google Meet generation (Placeholder)
            to_list = task_info["payload"]["to_list"]
            subject = task_info["payload"]["subject"]
            body = task_info["payload"]["body"] + "\n\nMeet Link: https://meet.google.com/new"
            
            for t in to_list:
                send_email(t, subject, body)
                
        result = {"status":"success"}
        
    except Exception as e:
        # If anything fails, log the error and notify the monitor agent
        result = {"status":"failed", "error": str(e)}
        monitor_agent.check(result, task_info)
        raise
        
    else:
        # On success, also notify the monitor agent
        monitor_agent.check(result, task_info)
        
    return result
