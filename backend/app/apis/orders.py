from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import jwt
from app.core.database import get_db
from app.schema.order import OrderCreate
from app.services.order_service import OrderService
from app.core.config import settings
from app.core.security import JWTBearer
from app.models.models import UserRole, Order, User
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

@router.get("/orders/{order_id}")
def get_order(
    order_id: uuid.UUID,
    db: Session = Depends(get_db),
    token: str = Depends(JWTBearer())
):
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    user_id = uuid.UUID(payload["sub"])
    order = OrderService.get_user_order_by_id(db, user_id, order_id)

    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")

    return order

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
    try:
        # Decode JWT token to get user_id
        decoded_token = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
        user_id = UUID(decoded_token["sub"])

        # Create order using OrderService
        return OrderService.create_order(
            db=db,
            order=order,
            user_id=user_id
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=422,
            detail="Invalid UUID format"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )   

@router.put("/orders/{order_id}/status")
async def update_order_status(
    order_id: str,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_db)
):
    return await OrderService.update_order_status(db, order_id, status)