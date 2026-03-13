from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from pydantic import BaseModel
import bcrypt

router = APIRouter()

class TeacherCreate(BaseModel):
    full_name: str
    email: str
    password: str

@router.get("/")
def get_teachers(db: Session = Depends(get_db)):
    teachers = db.query(User).filter(User.role == "teacher").all()
    return [
        {
            "id": t.id,
            "full_name": t.full_name,
            "email": t.email
        }
        for t in teachers
    ]

@router.post("/")
def add_teacher(req: TeacherCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists!")
    hashed = bcrypt.hashpw(req.password.encode(), bcrypt.gensalt())
    teacher = User(
        full_name=req.full_name,
        email=req.email,
        password=hashed.decode(),
        role="teacher"
    )
    db.add(teacher)
    db.commit()
    return {"message": "Teacher added successfully!"}

@router.delete("/{teacher_id}")
def delete_teacher(teacher_id: int, db: Session = Depends(get_db)):
    teacher = db.query(User).filter(
        User.id == teacher_id,
        User.role == "teacher"
    ).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found!")
    db.delete(teacher)
    db.commit()
    return {"message": "Teacher deleted!"}