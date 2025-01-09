from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.models import UserRole
from app.core.database import get_db
from app.schema.pizza import PizzaCreate, PizzaUpdate
from app.services.pizza_services import PizzaService
from app.core.security import JWTBearer
import jwt
import uuid

router = APIRouter()

@router.get("/pizzas")
def get_pizzas(db: Session = Depends(get_db)):
    return PizzaService.get_pizzas(db)

@router.post("/pizzas")
def create_pizza(
    pizza: PizzaCreate,
    db: Session = Depends(get_db),
    token: str = Depends(JWTBearer())
):
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    if payload.get("role") != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can create pizzas")
    return PizzaService.create_pizza(db, pizza)

@router.put("/pizzas/{pizza_id}")
def update_pizza(
    pizza_id: uuid.UUID,
    pizza_update: PizzaUpdate,
    db: Session = Depends(get_db),
    token: str = Depends(JWTBearer())
):
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    if payload.get("role") != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can update pizzas")
    return PizzaService.update_pizza(db, pizza_id, pizza_update)

@router.delete("/pizzas/{pizza_id}")
def delete_pizza(
    pizza_id: uuid.UUID,
    db: Session = Depends(get_db),
    token: str = Depends(JWTBearer())
):
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    if payload.get("role") != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can delete pizzas")
    PizzaService.delete_pizza(db, pizza_id)