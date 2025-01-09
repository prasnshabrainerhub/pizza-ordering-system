from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.models import UserRole
from app.core.database import get_db
from app.schema.pizza import PizzaCreate, ToppingCreate
from app.services.pizza_services import PizzaService
from app.core.security import JWTBearer
import jwt

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

@router.get("/toppings")
def get_toppings(db: Session = Depends(get_db)):

    return PizzaService.get_toppings(db)

@router.post("/toppings")
def create_topping(
    topping: ToppingCreate,
    db: Session = Depends(get_db),
    token: str = Depends(JWTBearer())
):
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    if payload.get("role") != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can create toppings")
    return PizzaService.create_topping(db, topping)