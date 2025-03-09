from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from services.utils import get_current_user
from models import Job, Payment, User
from services.utils import get_total_earnings

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/dashboard")
def get_dashboard_data(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    total_jobs = db.query(Job).count()
    pending_jobs = db.query(Job).filter(Job.status == "Pending").count()
    completed_jobs = db.query(Job).filter(Job.status == "Completed").count()
    
    total_earnings = db.query(Payment).filter(Payment.status == "Completed").with_entities(func.sum(Payment.amount)).scalar() or 0
    pending_payouts = db.query(Payment).filter(Payment.status == "Pending").with_entities(func.sum(Payment.amount)).scalar() or 0

    active_freelancers = db.query(User).filter(User.role == "freelancer", User.is_active == True).count()
    top_rated_freelancer = db.query(User).filter(User.role == "freelancer").order_by(User.rating.desc()).first()
    most_completed_jobs = db.query(Job.provider_id, func.count(Job.id)).filter(Job.status == "Completed").group_by(Job.provider_id).order_by(func.count(Job.id).desc()).first()

    return {
        "totalJobs": total_jobs,
        "pendingJobs": pending_jobs,
        "completedJobs": completed_jobs,
        "totalEarnings": total_earnings,
        "pendingPayouts": pending_payouts,
        "activeFreelancers": active_freelancers,
        "topRatedFreelancer": top_rated_freelancer.name if top_rated_freelancer else "",
        "mostCompletedJobs": most_completed_jobs[0] if most_completed_jobs else "",
    }
@router.get("/total-earnings")
def total_earnings(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return {"total_earnings": get_total_earnings(db)}
