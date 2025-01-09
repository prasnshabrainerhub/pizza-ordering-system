from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.models import UserRole
from app.core.database import get_db
from app.schema.toppings import ToppingCreate, ToppingUpdate
from app.core.security import JWTBearer
from app.services.toppings_services import ToppingService
import jwt
import uuid


router = APIRouter()

@router.get("/toppings")
def get_toppings(db: Session = Depends(get_db)):

    return ToppingService.get_toppings(db)

@router.post("/toppings")
def create_topping(
    topping: ToppingCreate,
    db: Session = Depends(get_db),
    token: str = Depends(JWTBearer())
):
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    if payload.get("role") != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can create toppings")
    return ToppingService.create_topping(db, topping)

@router.put("/toppings/{topping_id}")
def update_topping(
    topping_id: uuid.UUID,
    topping: ToppingUpdate,
    db: Session = Depends(get_db),
    token: str = Depends(JWTBearer())
):
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    if payload.get("role") != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can update toppings")
    return ToppingService.update_topping(db, topping_id, topping)

@router.delete("/toppings/{topping_id}")
def delete_topping(
    topping_id: uuid.UUID,
    db: Session = Depends(get_db),
    token: str = Depends(JWTBearer())
):
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    if payload.get("role") != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can delete toppings")
    ToppingService.delete_topping(db, topping_id)