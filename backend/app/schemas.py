from pydantic import BaseModel, EmailStr
from typing import Optional, Any, List, Dict
from uuid import UUID

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: Optional[str] = "staff"

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TemplateCreate(BaseModel):
    name: str
    content: str

class TemplateOut(BaseModel):
    id: UUID
    name: str
    content: str

class WorkflowCreate(BaseModel):
    name: str
    definition: Dict[str, Any]  # {"steps": [...], "schedule": {...}}

class WorkflowOut(BaseModel):
    id: UUID
    name: str
    definition: Dict[str, Any]
