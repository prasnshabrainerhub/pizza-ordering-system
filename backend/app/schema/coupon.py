from pydantic import BaseModel, constr
from datetime import datetime
from typing import Optional
from uuid import UUID
from app.models.models import DiscountType

class CouponCreate(BaseModel):
    code: constr(min_length=5, max_length=20)
    discount_type: DiscountType
    discount_value: float
    description: Optional[str] = None
    valid_from: datetime
    valid_until: datetime
    min_order_value: float = 0
    max_discount: Optional[float] = None
    usage_limit: Optional[int] = None

class CouponResponse(BaseModel):
    coupon_id: UUID
    code: str
    discount_type: DiscountType
    discount_value: float
    description: Optional[str]
    valid_until: datetime
    min_order_value: float
    max_discount: Optional[float]
    is_active: bool

    class Config:
        from_attributes = True
