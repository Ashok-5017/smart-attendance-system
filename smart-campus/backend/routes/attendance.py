from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from models.attendance import Attendance
from pydantic import BaseModel
from datetime import date

router = APIRouter()

class AttendanceCreate(BaseModel):
    student_id: int
    date: date
    status: str

@router.get("/")
def get_attendance(db: Session = Depends(get_db)):
    records = db.query(Attendance).all()
    result = []
    for r in records:
        student = db.query(User).filter(User.id == r.student_id).first()
        result.append({
            "id": r.id,
            "student_id": r.student_id,
            "student_name": student.full_name if student else "Unknown",
            "date": str(r.date),
            "status": r.status
        })
    return result

@router.post("/")
def mark_attendance(req: AttendanceCreate, db: Session = Depends(get_db)):
    existing = db.query(Attendance).filter(
        Attendance.student_id == req.student_id,
        Attendance.date == req.date
    ).first()
    if existing:
        existing.status = req.status
        db.commit()
        return {"message": "Attendance updated!"}
    attendance = Attendance(
        student_id=req.student_id,
        date=req.date,
        status=req.status
    )
    db.add(attendance)
    db.commit()
    return {"message": "Attendance marked!"}

@router.delete("/{attendance_id}")
def delete_attendance(attendance_id: int, db: Session = Depends(get_db)):
    record = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found!")
    db.delete(record)
    db.commit()
    return {"message": "Deleted!"}