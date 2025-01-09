from pydantic import BaseModel, UUID4
from typing import List, Optional
from datetime import datetime
from app.models.models import OrderStatus
from app.schema.pizza import PizzaResponse, ToppingResponse

class OrderItemCreate(BaseModel):
    pizza_id: UUID4
    quantity: int
    custom_toppings: List[UUID4] = []

class OrderItemResponse(BaseModel):
    item_id: UUID4
    pizza: PizzaResponse
    quantity: int
    custom_toppings: List[ToppingResponse]
    item_price: float

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    delivery_address: str
    notes: Optional[str] = None
    contact_number: str
    pizza_size: str
    coupon_code: Optional[str] = None

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
