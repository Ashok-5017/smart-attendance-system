from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base

class Timetable(Base):
    __tablename__ = "timetable"
    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String(100), nullable=False)
    teacher_id = Column(Integer, nullable=True)
    day = Column(String(20), nullable=False)
    start_time = Column(String(20), nullable=False)
    end_time = Column(String(20), nullable=False)
    class_name = Column(String(50), nullable=False)
    created_at = Column(DateTime, server_default=func.now())