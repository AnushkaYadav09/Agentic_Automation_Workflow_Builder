# backend/app/auth/routes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserCreate, Token
from app.auth.jwt_handler import create_access_token, verify_access_token, get_password_hash, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=dict)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(email=payload.email, hashed_password=get_password_hash(payload.password), role=payload.role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"id": str(user.id), "email": user.email, "role": user.role}

@router.post("/login", response_model=Token)
def login(payload: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    return {"access_token": token}
