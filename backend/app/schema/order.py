from pydantic import BaseModel, UUID4
from typing import List, Optional
from datetime import datetime
from app.models.models import OrderStatus
from app.schema.pizza import PizzaResponse
from app.schema.toppings import ToppingResponse
from app.schema.payment import PaymentMethod, PaymentStatus

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
    payment_method: PaymentMethod
    payment_status: PaymentStatus
    contact_number: str
    delivery_address: str
    total_amount: float
    # coupon_code: Optional[str]

class PaymentLinkRequest(BaseModel):
    amount: float
    payment_type: str
    order_items: List[OrderItemCreate]
    delivery_address: str
    contact_number: str

    def to_order_create(self) -> OrderCreate:
        """Convert PaymentLinkRequest to OrderCreate"""
        return OrderCreate(
            order_items=self.order_items,
            payment_method=PaymentMethod.ONLINE,
            payment_status=PaymentStatus.PENDING,
            total_amount=self.amount,
            delivery_address=self.delivery_address,
            contact_number=self.contact_number,
        )

class OrderResponse(BaseModel):
    order_id: UUID4
    status: OrderStatus
    total_amount: float
    created_at: datetime
    updated_at: datetime
    delivery_address: str
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: OrderStatus
