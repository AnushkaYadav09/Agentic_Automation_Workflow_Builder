from fastapi import APIRouter
from app.ai.prompt_builder import prompt_builder_agent

router = APIRouter(prefix="/ai", tags=["AI"])

@router.post("/problem-to-workflow")
def convert_problem_to_workflow(text: str, template_id: str = None):
    workflow_def = prompt_builder_agent.build_workflow(text, template_id)
    return {"workflow_definition": workflow_def}
