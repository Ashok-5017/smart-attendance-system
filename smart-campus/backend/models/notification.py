from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from database import Base

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    target = Column(String(50), default="all")  # all, student, teacher
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())