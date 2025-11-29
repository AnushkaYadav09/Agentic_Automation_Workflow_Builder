import uuid
from sqlalchemy import Column, String, Text, Enum, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String(50), default="staff")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Template(Base):
    __tablename__ = "templates"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    creator_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Workflow(Base):
    __tablename__ = "workflows"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    definition = Column(JSON, nullable=False)  # steps, schedule etc.
    creator_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class WorkflowLog(Base):
    __tablename__ = "workflow_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workflow_id = Column(UUID(as_uuid=True), ForeignKey("workflows.id"))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    step = Column(String(255))
    status = Column(String(50))
    message = Column(Text)
