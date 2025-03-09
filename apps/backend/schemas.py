from pydantic import BaseModel

class UserApproval(BaseModel):
    user_id: int

class UserRejection(BaseModel):
    reason: str
