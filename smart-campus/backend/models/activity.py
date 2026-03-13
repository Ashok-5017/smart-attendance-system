from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from database import Base

class Activity(Base):
    __tablename__ = "activities"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, default="")
    date = Column(String(20))
    location = Column(String(200), default="")
    organizer = Column(String(100), default="")
    created_at = Column(DateTime, server_default=func.now())