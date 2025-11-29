from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.database import get_db
from app.models import Template
from app.schemas import TemplateCreate, TemplateOut

router = APIRouter(prefix="/templates", tags=["templates"])

@router.post("/", response_model=TemplateOut)
def create_template(payload: TemplateCreate, db: Session = Depends(get_db), creator_id: UUID = None):
    # creator_id can be taken from auth token in real flow
    template = Template(name=payload.name, content=payload.content, creator_id=creator_id)
    db.add(template); db.commit(); db.refresh(template)
    return template

@router.get("/{template_id}", response_model=TemplateOut)
def get_template(template_id: UUID, db: Session = Depends(get_db)):
    tpl = db.query(Template).filter(Template.id == template_id).first()
    if not tpl:
        raise HTTPException(404, "Template not found")
    return tpl
