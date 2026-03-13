from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.subject import Subject
from models.user import User
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class SubjectCreate(BaseModel):
    name: str
    code: str
    teacher_id: Optional[int] = None
    class_name: str

@router.get("/")
def get_subjects(db: Session = Depends(get_db)):
    subjects = db.query(Subject).all()
    result = []
    for s in subjects:
        teacher = db.query(User).filter(User.id == s.teacher_id).first()
        result.append({
            "id": s.id,
            "name": s.name,
            "code": s.code,
            "teacher_name": teacher.full_name if teacher else "Not Assigned",
            "class_name": s.class_name
        })
    return result

@router.post("/")
def create_subject(req: SubjectCreate, db: Session = Depends(get_db)):
    subject = Subject(
        name=req.name,
        code=req.code,
        teacher_id=req.teacher_id,
        class_name=req.class_name
    )
    db.add(subject)
    db.commit()
    return {"message": "Subject created!"}

@router.delete("/{subject_id}")
def delete_subject(subject_id: int, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Not found!")
    db.delete(subject)
    db.commit()
    return {"message": "Deleted!"}