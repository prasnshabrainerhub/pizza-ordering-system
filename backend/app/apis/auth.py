from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schema.user import UserCreate, UserLogin, Token
from app.services.auth_services import AuthService
from app.core.security import create_access_token, create_refresh_token
from typing import Any

router = APIRouter()

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schema.user import UserCreate, UserLogin, Token
from app.services.auth_services import AuthService
from app.core.security import create_access_token, create_refresh_token
from datetime import datetime, timezone

router = APIRouter()

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    if AuthService.get_user_by_email(db, user.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered."
        )
    db_user = AuthService.register_user(db, user)
    return {"message": "User registered successfully", "user_id": db_user.user_id}


@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = AuthService.authenticate_user(db, user_data.email, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    access_token = create_access_token(
        data={"sub": str(user.user_id), "role": user.role}
    )
    refresh_token = create_refresh_token(
        data={"sub": str(user.user_id)}
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "message": "Login successful",
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "token_type": "bearer"
    }
