from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy.sql.sqltypes import DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from database import Base

# ✅ Payment Model (From Consumers)
class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Consumer who paid
    amount = Column(Float, nullable=False)
    status = Column(String, default="Pending")  # Pending, Completed, Failed
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="payments")

# ✅ Payout Model (To Service Providers)
class Payout(Base):
    __tablename__ = "payouts"

    id = Column(Integer, primary_key=True, index=True)
    service_provider_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Provider getting paid
    amount = Column(Float, nullable=False)
    status = Column(String, default="Pending")  # Pending, Processed, Failed
    created_at = Column(DateTime, default=datetime.utcnow)

    service_provider = relationship("User", back_populates="payouts")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    service_provider_id = Column(Integer, ForeignKey("users.id"))
    consumer_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String, default="Pending")  # 'Pending', 'Ongoing', 'Completed'
    created_at = Column(DateTime, default=datetime.utcnow)

    service_provider = relationship("User", foreign_keys=[service_provider_id])
    consumer = relationship("User", foreign_keys=[consumer_id])

