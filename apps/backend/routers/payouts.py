from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Payout
from services.utils import get_current_user
import stripe
import os
from dotenv import load_dotenv

load_dotenv()
router = APIRouter(prefix="/payouts", tags=["Payouts"])

# Stripe API Key
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")


# Dependency: Get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ✅ Fetch All Payout Requests
@router.get("/")
def get_payouts(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return db.query(Payout).all()


# ✅ Request a Payout (By Service Provider)
@router.post("/request")
def request_payout(amount: float, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount")

    payout = Payout(user_id=current_user["id"], amount=amount, status="Pending")
    db.add(payout)
    db.commit()
    db.refresh(payout)

    return {"message": "Payout request submitted", "payout_id": payout.id}


# ✅ Approve Payout
@router.post("/{payout_id}/approve")
def approve_payout(payout_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    payout = db.query(Payout).filter(Payout.id == payout_id).first()
    if not payout:
        raise HTTPException(status_code=404, detail="Payout request not found")
    if payout.status != "Pending":
        raise HTTPException(status_code=400, detail="Payout already processed")

    payout.status = "Approved"
    db.commit()
    return {"message": "Payout approved"}


# ✅ Reject Payout
@router.post("/{payout_id}/reject")
def reject_payout(payout_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    payout = db.query(Payout).filter(Payout.id == payout_id).first()
    if not payout:
        raise HTTPException(status_code=404, detail="Payout request not found")
    if payout.status != "Pending":
        raise HTTPException(status_code=400, detail="Payout already processed")

    payout.status = "Rejected"
    db.commit()
    return {"message": "Payout rejected"}


# ✅ Process Payout via Stripe
@router.post("/{payout_id}/process")
def process_payout(payout_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    payout = db.query(Payout).filter(Payout.id == payout_id, Payout.status == "Approved").first()
    
    if not payout:
        raise HTTPException(status_code=400, detail="Invalid or already processed payout")

    try:
        stripe_payout = stripe.Payout.create(
            amount=int(payout.amount * 100), 
            currency="usd",
            method="instant"
        )
        
        payout.status = "Completed"
        db.commit()

        return {"message": "Payout processed", "stripe_payout_id": stripe_payout.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
