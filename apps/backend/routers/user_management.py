from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserApproval, UserRejection
from services.utils import get_current_user
from services.utils import get_total_earnings

router = APIRouter( prefix="/user-management", tags=["User Management"])

@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@router.post("/users/approve/{user_id}")
def approve_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.status = "Approved"
    db.commit()
    return {"message": f"User {user.name} approved successfully"}

@router.post("/users/reject/{user_id}")
def reject_user(user_id: int, rejection: UserRejection, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.status = "Rejected"
    user.rejection_reason = rejection.reason
    db.commit()
    return {"message": f"User {user.name} rejected for reason: {rejection.reason}"}

@router.get("/total-earnings")
def total_earnings(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return {"total_earnings": get_total_earnings(db)}