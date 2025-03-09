from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from services.auth import router as auth_router
from routers.payments import router as payments_router
from routers.dashboard import router as dashboard_router
from routers.job_management import router as job_management_router 
from routers.user_management import router as user_management_router
from routers.reports import router as reports_router

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Include Routers
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(payments_router, prefix="/payments", tags=["Payments"])
app.include_router(dashboard_router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(job_management_router, prefix="/job-management", tags=["Job Management"])
app.include_router(user_management_router, prefix="/users", tags=["User Management"])
app.include_router(reports_router, prefix="/reports", tags=["Reports"])

@app.get("/")
def read_root():
    return {"message": "Welcome to The Freelancer App!"}

# run the app: uvicorn main:app --reload --host 0.0.0.0 --port 5174