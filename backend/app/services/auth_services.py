from fastapi import HTTPException, status
from sqlalchemy.orm import Session
import datetime
from passlib.context import CryptContext
from app.models.models import User
from app.schema.user import UserCreate
from app.core.security import create_refresh_token

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    @staticmethod
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def register_user(db: Session, user: UserCreate) -> User:
        db_user = db.query(User).filter(User.email == user.email).first()
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already registered."
            )
        
        hashed_password = AuthService.get_password_hash(user.password)
        refresh_token_data = {"email": user.email, "username": user.username}
        refresh_token = create_refresh_token(refresh_token_data)
        db_user = User(
            email=user.email,
            username=user.username,
            hashed_password=hashed_password,
            role=user.role.lower(),  # Ensure role is lowercase
            phone_number=user.phone_number,
            address=user.address,
            refresh_token=refresh_token,
            created_at=datetime.datetime.now(datetime.UTC),  # Updated to use timezone-aware datetime
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> User:
        user = db.query(User).filter(User.email == email).first()
        if not user or not AuthService.verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,  # Changed from 400 to 401
                detail="Incorrect email or password."
            )
        return user
    
    @staticmethod
    def get_user_by_email(db: Session, email: str):
        return db.query(User).filter(User.email == email).first()