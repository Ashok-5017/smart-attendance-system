from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.timetable import Timetable
from models.user import User
from pydantic import BaseModel

router = APIRouter()

class TimetableCreate(BaseModel):
    subject: str
    teacher_id: int
    day: str
    start_time: str
    end_time: str
    class_name: str

@router.get("/")
def get_timetable(db: Session = Depends(get_db)):
    records = db.query(Timetable).all()
    result = []
    for r in records:
        teacher = db.query(User).filter(User.id == r.teacher_id).first()
        result.append({
            "id": r.id,
            "subject": r.subject,
            "teacher_name": teacher.full_name if teacher else "Unknown",
            "day": r.day,
            "start_time": r.start_time,
            "end_time": r.end_time,
            "class_name": r.class_name
        })
    return result

@router.post("/")
def add_timetable(req: TimetableCreate, db: Session = Depends(get_db)):
    record = Timetable(
        subject=req.subject,
        teacher_id=req.teacher_id,
        day=req.day,
        start_time=req.start_time,
        end_time=req.end_time,
        class_name=req.class_name
    )
    db.add(record)
    db.commit()
    return {"message": "Timetable added!"}

@router.delete("/{timetable_id}")
def delete_timetable(timetable_id: int, db: Session = Depends(get_db)):
    record = db.query(Timetable).filter(Timetable.id == timetable_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Not found!")
    db.delete(record)
    db.commit()
    return {"message": "Deleted!"}