from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from pydantic import BaseModel
import bcrypt
from jose import jwt
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
SECRET_KEY = os.getenv("SECRET_KEY", "smartcampus2024secretkey")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str
    role: str = "student"

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists!")
    hashed = bcrypt.hashpw(req.password.encode(), bcrypt.gensalt())
    user = User(
        full_name=req.full_name,
        email=req.email,
        password=hashed.decode(),
        role=req.role
    )
    db.add(user)
    db.commit()
    return {"message": "Registered successfully! ✅"}

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="User not found!")
    if not bcrypt.checkpw(req.password.encode(), user.password.encode()):
        raise HTTPException(status_code=400, detail="Wrong password!")
    token = jwt.encode(
        {"id": user.id, "role": user.role, "email": user.email},
        SECRET_KEY, algorithm=ALGORITHM
    )
    return {"token": token, "role": user.role, "name": user.full_name}