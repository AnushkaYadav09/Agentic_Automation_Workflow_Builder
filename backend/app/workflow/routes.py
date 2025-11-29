from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.database import get_db
from app.models import Workflow, WorkflowLog, Template
from app.schemas import WorkflowCreate, WorkflowOut
from app.workflow.planner import planner_agent
from app.workflow.executor import execute_task
from app.workflow.scheduler import schedule_weekly_report

router = APIRouter(prefix="/workflows", tags=["workflows"])

@router.post("/", response_model=WorkflowOut)
def create_workflow(payload: WorkflowCreate, db: Session = Depends(get_db), creator_id: UUID = None):
    """
    Create a new workflow definition.

    Args:
        payload (WorkflowCreate): The workflow name and definition (steps).
        db (Session): Database session.
        creator_id (UUID): ID of the user creating the workflow.

    Returns:
        Workflow: The created workflow object.
    """
    try:
        wf = Workflow(name=payload.name, definition=payload.definition, creator_id=creator_id)
        db.add(wf); db.commit(); db.refresh(wf)
        return wf
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{workflow_id}/plan")
def plan_workflow(workflow_id: UUID, db: Session = Depends(get_db)):
    wf = db.query(Workflow).filter(Workflow.id == workflow_id).first()
    if not wf:
        raise HTTPException(404, "Workflow not found")
    plan = planner_agent.plan(wf)
    return {"plan": plan}

@router.post("/{workflow_id}/execute")
def execute_workflow(workflow_id: UUID, db: Session = Depends(get_db)):
    """
    Execute a workflow by planning its steps and queuing them for background execution.

    1. Fetch the workflow from DB.
    2. Use PlannerAgent to generate a list of executable steps.
    3. Send each step to the Celery worker queue.

    Args:
        workflow_id (UUID): The ID of the workflow to execute.
    """
    wf = db.query(Workflow).filter(Workflow.id == workflow_id).first()
    if not wf:
        raise HTTPException(404, "Workflow not found")
    
    # Step 1: Plan the workflow
    plan = planner_agent.plan(wf)
    
    # Step 2: Enqueue tasks sequentially
    task_results = []
    for step in plan:
        payload = step["payload"]
        
        # If it's an email step with a template_id, fetch the template content
        if payload.get("type") == "email" and payload.get("template_id"):
            tpl = db.query(Template).filter(Template.id == payload["template_id"]).first()
            payload["body"] = tpl.content if tpl else payload.get("body", "")
            
        # Step 3: Push to Celery (Background Task)
        # apply_async sends the task to Redis, where a worker will pick it up.
        res = execute_task.apply_async(args=( {"type": step["type"], "payload": payload}, ))
        task_results.append({"task_id": res.id})
        
    return {"enqueued": task_results}

@router.post("/{workflow_id}/schedule")
def schedule_workflow(workflow_id: UUID, db: Session = Depends(get_db)):
    wf = db.query(Workflow).filter(Workflow.id == workflow_id).first()
    if not wf:
        raise HTTPException(404, "Workflow not found")
    schedule = wf.definition.get("schedule", {})
    weekday = schedule.get("weekday", 1)  # default monday
    hour = schedule.get("hour", 10)
    # example payload (we'll pass the first step payload)
    steps = wf.definition.get("steps", [])
    payload = steps[0] if steps else {}
    schedule_weekly_report(str(workflow_id), weekday=weekday, hour=hour, payload={"type": payload.get("type"), "payload": payload})
    return {"scheduled": True}
