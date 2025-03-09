from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Payment
from services.utils import get_current_user
import stripe
import os
from dotenv import load_dotenv

load_dotenv()
router = APIRouter(prefix="/payments", tags=["Payments"])

# Stripe API Key
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

# Dependency: Get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ Fetch Payments List (Only for the logged-in consumer)
@router.get("/")
def get_payments(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return db.query(Payment).filter(Payment.user_id == current_user["id"]).all()

# ✅ Create a Payment (Consumer initiates payment)
@router.post("/")
def create_payment(amount: float, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    payment = Payment(user_id=current_user["id"], amount=amount, status="Pending")
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return {"message": "Payment created", "payment": payment}

# ✅ Process Payment via Stripe
@router.post("/checkout")
def create_checkout_session(payment_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    payment = db.query(Payment).filter(Payment.id == payment_id, Payment.user_id == current_user["id"], Payment.status == "Pending").first()
    
    if not payment:
        raise HTTPException(status_code=400, detail="Invalid or already processed payment")

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {"name": "Service Payment"},
                        "unit_amount": int(payment.amount * 100),
                    },
                    "quantity": 1,
                }
            ],
            mode="payment",
            success_url="https://yourfrontend.com/success",
            cancel_url="https://yourfrontend.com/cancel",
        )

        return {"sessionId": session.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
