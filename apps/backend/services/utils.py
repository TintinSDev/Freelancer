# utils.py
from sqlalchemy.sql import func
from fastapi import Depends, HTTPException
from jose import JWTError, jwt
from database import SessionLocal
from sqlalchemy.orm import Session
from models import User
from models import Payment
import os

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
 
def get_total_earnings(db: Session):
    """Calculate total earnings from completed payments"""
    total = db.query(func.sum(Payment.amount)).filter(Payment.status == "Completed").scalar()
    return total if total else 0  # Return 0 if there are no earnings
def get_pending_payouts(db: Session):
    total = db.query(func.sum(Payment.amount)).filter(Payment.status == "Pending").scalar()
    return total or 0
def get_total_payments(db: Session):
    total = db.query(func.count(Payment.id)).scalar()
    return total
def get_total_payments_amount(db: Session):
    total = db.query(func.sum(Payment.amount)).scalar()
    return total or 0

def get_current_user(token: str, db: Session = Depends(get_db)):
    """Extract user from JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
