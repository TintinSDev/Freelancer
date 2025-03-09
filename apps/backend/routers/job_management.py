from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from services.utils import get_current_user
from models import Job, User

router = APIRouter( prefix="/job-management", tags=["Job Management"])

@router.get("/job-management")
def get_job_management_data(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    total_jobs = db.query(Job).count()
    pending_jobs = db.query(Job).filter(Job.status == "Pending").count()
    completed_jobs = db.query(Job).filter(Job.status == "Completed").count()

    total_earnings = db.query(Job).filter(Job.status == "Completed").with_entities(func.sum(Job.price)).scalar() or 0

    active_freelancers = db.query(User).filter(User.role == "freelancer", User.is_active == True).count()
    top_rated_freelancer = db.query(User).filter(User.role == "freelancer").order_by(User.rating.desc()).first()
    most_completed_jobs = db.query(Job.provider_id, func.count(Job.id)).filter(Job.status == "Completed").group_by(Job.provider_id).order_by(func.count(Job.id).desc()).first()

    return {
        "totalJobs": total_jobs,
        "pendingJobs": pending_jobs,
        "completedJobs": completed_jobs,
        "totalEarnings": total_earnings,
        "activeFreelancers": active_freelancers,
        "topRatedFreelancer": top_rated_freelancer.name if top_rated_freelancer else "",
        "mostCompletedJobs": most_completed_jobs[0] if most_completed_jobs else "",
    }

@router.get("/jobs")
def get_jobs(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    jobs = db.query(Job).all()
    return [{"id": job.id, "title": job.title, "status": job.status, "provider": job.provider_id} for job in jobs]

@router.get("/freelancers")
def get_freelancers(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    freelancers = db.query(User).filter(User.role == "freelancer").all()
    return [{"id": freelancer.id, "name": freelancer.name} for freelancer in freelancers]

@router.post("/assign-job/{job_id}")
def assign_job(job_id: int, freelancer_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id).first()
    freelancer = db.query(User).filter(User.id == freelancer_id, User.role == "freelancer").first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if not freelancer:
        raise HTTPException(status_code=404, detail="Freelancer not found")

    job.provider_id = freelancer.id
    job.status = "Assigned"
    db.commit()

    return {"message": f"Job {job_id} assigned to {freelancer.name}"}
