from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.notification import Notification
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class NotificationCreate(BaseModel):
    title: str
    message: str
    target: Optional[str] = "all"

@router.get("/")
def get_notifications(db: Session = Depends(get_db)):
    return db.query(Notification).order_by(Notification.created_at.desc()).all()

@router.post("/")
def create_notification(req: NotificationCreate, db: Session = Depends(get_db)):
    notification = Notification(
        title=req.title,
        message=req.message,
        target=req.target
    )
    db.add(notification)
    db.commit()
    return {"message": "Notification sent!"}

@router.put("/{notification_id}/read")
def mark_as_read(notification_id: int, db: Session = Depends(get_db)):
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Not found!")
    notification.is_read = True
    db.commit()
    return {"message": "Marked as read!"}

@router.delete("/{notification_id}")
def delete_notification(notification_id: int, db: Session = Depends(get_db)):
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Not found!")
    db.delete(notification)
    db.commit()
    return {"message": "Deleted!"}