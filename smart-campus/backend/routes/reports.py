from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from models.attendance import Attendance
from models.subject import Subject
from models.activity import Activity
from models.timetable import Timetable

router = APIRouter()

@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    total_students = db.query(User).filter(User.role == "student").count()
    total_teachers = db.query(User).filter(User.role == "teacher").count()
    total_subjects = db.query(Subject).count()
    total_activities = db.query(Activity).count()
    total_timetable = db.query(Timetable).count()
    total_attendance = db.query(Attendance).count()
    present_count = db.query(Attendance).filter(Attendance.status == "Present").count()
    attendance_rate = round((present_count / total_attendance * 100), 1) if total_attendance > 0 else 0

    return {
        "total_students": total_students,
        "total_teachers": total_teachers,
        "total_subjects": total_subjects,
        "total_activities": total_activities,
        "total_timetable": total_timetable,
        "total_attendance": total_attendance,
        "present_count": present_count,
        "attendance_rate": attendance_rate
    }

@router.get("/attendance-detail")
def get_attendance_detail(db: Session = Depends(get_db)):
    records = db.query(Attendance).all()
    result = []
    for r in records:
        student = db.query(User).filter(User.id == r.student_id).first()
        result.append({
            "student_name": student.full_name if student else "Unknown",
            "date": str(r.date),
            "status": r.status
        })
    return result

@router.get("/students-list")
def get_students_report(db: Session = Depends(get_db)):
    students = db.query(User).filter(User.role == "student").all()
    result = []
    for s in students:
        attendance = db.query(Attendance).filter(Attendance.student_id == s.id).all()
        present = len([a for a in attendance if a.status == "Present"])
        total = len(attendance)
        rate = round((present / total * 100), 1) if total > 0 else 0
        result.append({
            "id": s.id,
            "name": s.full_name,
            "email": s.email,
            "total_attendance": total,
            "present": present,
            "attendance_rate": rate
        })
    return result