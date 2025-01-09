from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import jwt
from app.core.database import get_db
from app.schema.order import OrderCreate, OrderStatusUpdate
from app.services.order_service import OrderService
from app.core.config import settings
from app.core.security import JWTBearer
from app.models.models import UserRole, Order
from uuid import UUID
import uuid

router = APIRouter()

@router.get("/orders")
def get_orders(
    db: Session = Depends(get_db),
    token: str = Depends(JWTBearer())
    ):
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    user_id = uuid.UUID(payload["sub"])
    return OrderService.get_user_orders(db, user_id)

@router.get("/orders/history")
def get_order_history(
    db: Session = Depends(get_db),
    token: str = Depends(JWTBearer())
):
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    if payload.get("role") != UserRole.ADMIN:
         raise HTTPException(status_code=403, detail="Only admins can get order history")
    return db.query(Order).all()

@router.post("/orders")
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    token: str = Depends(JWTBearer())
):
    user_id = UUID(jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])["sub"])
    return OrderService.create_order(db, order, user_id)   

@router.patch("/orders/{order_id}/status")
def update_order_status(
    order_id: UUID,
    status_update: OrderStatusUpdate,
    db: Session = Depends(get_db),
    token: str = Depends(JWTBearer())
):
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    if payload.get("role") != UserRole.ADMIN:
         raise HTTPException(status_code=403, detail="Only admins can update order status")
    return OrderService.update_order_status(db, order_id, status_update.status)
