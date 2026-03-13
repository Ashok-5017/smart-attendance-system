from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.activity import Activity
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class ActivityCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    date: str
    location: Optional[str] = ""
    organizer: Optional[str] = ""

@router.get("/")
def get_activities(db: Session = Depends(get_db)):
    return db.query(Activity).all()

@router.post("/")
def create_activity(req: ActivityCreate, db: Session = Depends(get_db)):
    activity = Activity(
        title=req.title,
        description=req.description,
        date=req.date,
        location=req.location,
        organizer=req.organizer
    )
    db.add(activity)
    db.commit()
    return {"message": "Activity created!"}

@router.delete("/{activity_id}")
def delete_activity(activity_id: int, db: Session = Depends(get_db)):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Not found!")
    db.delete(activity)
    db.commit()
    return {"message": "Deleted!"}