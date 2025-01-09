from pydantic import BaseModel, EmailStr
from typing import Optional
from app.models.models import UserRole

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    phone_number: Optional[str]
    address: Optional[str]
    role: Optional[UserRole] = UserRole.USER

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
