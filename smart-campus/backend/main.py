from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from models.user import User
from models.attendance import Attendance
from models.timetable import Timetable
from models.activity import Activity
from models.subject import Subject
from models.notification import Notification
from routes import auth, students, teachers, attendance, timetable, activities, subjects, reports, notifications

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Campus API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(students.router, prefix="/students", tags=["Students"])
app.include_router(teachers.router, prefix="/teachers", tags=["Teachers"])
app.include_router(attendance.router, prefix="/attendance", tags=["Attendance"])
app.include_router(timetable.router, prefix="/timetable", tags=["Timetable"])
app.include_router(activities.router, prefix="/activities", tags=["Activities"])
app.include_router(subjects.router, prefix="/subjects", tags=["Subjects"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])
app.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])

@app.get("/")
def root():
    return {"message": "Smart Campus API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)