from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserCreate
from app.auth.jwt_handler import get_password_hash

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=dict)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    user = User(email=payload.email, hashed_password=get_password_hash(payload.password), role=payload.role)
    db.add(user); db.commit(); db.refresh(user)
    return {"id": str(user.id), "email": user.email, "role": user.role}
