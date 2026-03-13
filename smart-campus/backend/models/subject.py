from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    code = Column(String(20), nullable=False)
    teacher_id = Column(Integer, nullable=True)
    class_name = Column(String(50), nullable=False)
    created_at = Column(DateTime, server_default=func.now())