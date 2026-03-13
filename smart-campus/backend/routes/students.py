from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from pydantic import BaseModel
import bcrypt

router = APIRouter()

class StudentCreate(BaseModel):
    full_name: str
    email: str
    password: str

@router.get("/")
def get_students(db: Session = Depends(get_db)):
    students = db.query(User).filter(User.role == "student").all()
    return [
        {
            "id": s.id,
            "full_name": s.full_name,
            "email": s.email
        }
        for s in students
    ]

@router.post("/")
def add_student(req: StudentCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists!")
    hashed = bcrypt.hashpw(req.password.encode(), bcrypt.gensalt())
    student = User(
        full_name=req.full_name,
        email=req.email,
        password=hashed.decode(),
        role="student"
    )
    db.add(student)
    db.commit()
    return {"message": "Student added successfully!"}

@router.delete("/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(User).filter(
        User.id == student_id,
        User.role == "student"
    ).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found!")
    db.delete(student)
    db.commit()
    return {"message": "Student deleted!"}