from pydantic import BaseModel, UUID4
from typing import List, Optional
from datetime import datetime
from app.models.models import OrderStatus
from app.schema.pizza import PizzaResponse
from app.schema.toppings import ToppingResponse

class OrderItemCreate(BaseModel):
    pizza_id: Optional[str] = None  # Allow null
    quantity: int
    size: str
    custom_toppings: List[Optional[str]] = []  # Allow null in list

class OrderItemResponse(BaseModel):
    item_id: UUID4
    pizza: PizzaResponse
    quantity: int
    custom_toppings: List[ToppingResponse]

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    order_items: List[OrderItemCreate]  # Changed from items to order_items
    payment_method: str
    payment_status: str
    contact_number: str
    delivery_address: str
    notes: str = ""
    total_amount: float
    # coupon_code: Optional[str]

class OrderResponse(BaseModel):
    order_id: UUID4
    status: OrderStatus
    total_amount: float
    created_at: datetime
    updated_at: datetime
    delivery_address: str
    notes: Optional[str]
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: OrderStatus
