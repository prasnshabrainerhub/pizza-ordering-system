from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import jwt
from app.core.database import get_db
from app.schema.order import OrderCreate
from app.services.order_service import OrderService
from app.core.config import settings
from app.core.security import JWTBearer
from app.models.models import UserRole, Order, OrderStatus
from uuid import UUID
import uuid
from app.services.order_status_service import OrderStatusService

router = APIRouter()

@router.get("/orders")
def get_orders(
    db: Session = Depends(get_db),
    token: str = Depends(JWTBearer())
    ):
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    user_id = uuid.UUID(payload["sub"])
    return OrderService.get_user_orders(db, user_id)

@router.get("/orders/history")  # Moved before the parameterized route
def get_order_history(
    db: Session = Depends(get_db),
    token: str = Depends(JWTBearer())
):
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    if payload.get("role") != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can get order history")
    return db.query(Order).all()

@router.get("/orders/{order_id}")  # Now comes after /orders/history
def get_order_by_id(
    order_id: uuid.UUID,
    db: Session = Depends(get_db),
    token: str = Depends(JWTBearer())
):
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/orders")
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    token: str = Depends(JWTBearer())
):
    try:
        decoded_token = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
        user_id = UUID(decoded_token["sub"])
        
        new_order = Order(
            user_id=user_id,
            status=OrderStatus.RECEIVED,
            total_amount=order.total_amount,
            delivery_address=order.delivery_address,
            contact_number=order.contact_number
        )
        
        db.add(new_order)
        db.commit()
        db.refresh(new_order)
        
        OrderStatusService.start_status_updates(db, new_order.order_id)
        
        return new_order
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )