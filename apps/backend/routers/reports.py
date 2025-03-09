from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from database import get_db
from models import Job
from datetime import datetime
from services.utils import get_current_user
from services.utils import get_total_earnings

router = APIRouter(prefix="/reports", tags=["Reports"] )

@router.get("/reports")
def get_reports(db: Session = Depends(get_db)):
    completed_jobs = db.query(Job).filter(Job.status == "Completed").count()
    pending_jobs = db.query(Job).filter(Job.status == "Pending").count()
    in_progress_jobs = db.query(Job).filter(Job.status == "In Progress").count()
    cancelled_jobs = db.query(Job).filter(Job.status == "Cancelled").count()

    earnings = (
        db.query(extract("month", Job.completed_at).label("month"), func.sum(Job.price).label("earnings"))
        .filter(Job.status == "Completed", Job.completed_at.isnot(None))
        .group_by("month")
        .order_by("month")
        .all()
    )

    return {
        "completedJobs": completed_jobs,
        "pendingJobs": pending_jobs,
        "inProgressJobs": in_progress_jobs,
        "cancelledJobs": cancelled_jobs,
        "earnings": [{"month": datetime(2025, month, 1).strftime("%B"), "earnings": earnings} for month, earnings in earnings],
    }
@router.get("/total-earnings")
def total_earnings(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return {"total_earnings": get_total_earnings(db)}
