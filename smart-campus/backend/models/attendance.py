from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, nullable=True)
    date = Column(Date, nullable=False)
    status = Column(String(20), nullable=False, default="present")
    marked_by = Column(Integer, nullable=True)
    created_at = Column(DateTime, server_default=func.now())