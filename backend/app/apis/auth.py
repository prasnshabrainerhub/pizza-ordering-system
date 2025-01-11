from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schema.user import UserCreate, UserLogin, Token
from app.services.auth_services import AuthService
from app.core.security import create_access_token, create_refresh_token
from typing import Any

router = APIRouter()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = AuthService.register_user(db, user)
    
    access_token = create_access_token(
        data={"sub": str(db_user.user_id), "role": db_user.role}
    )
    refresh_token = create_refresh_token(
        data={"sub": str(db_user.user_id)}
    )
    
    return {"message":"User registered Sucessfully"} 

@router.post("/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = AuthService.authenticate_user(db, user_data.email, user_data.password)
    
    access_token = create_access_token(
        data={"sub": str(user.user_id), "role": user.role}
    )
    refresh_token = create_refresh_token(
        data={"sub": str(user.user_id)}
    )
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "message": "Login Successful",
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "token_type": "bearer"
    }
