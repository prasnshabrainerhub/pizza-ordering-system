from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional
from app.models.models import Coupon, CouponUsage
from app.schema.coupon import DiscountType, CouponCreate

class CouponService:
    
    @staticmethod
    def validate_and_apply_coupon(
        db: Session,
        coupon_code: str,
        user_id: UUID,
        order_amount: float
    ) -> tuple[Optional[Coupon], Optional[float]]:
        coupon = db.query(Coupon).filter(
            Coupon.code == coupon_code,
            Coupon.is_active == True,
            Coupon.valid_from <= datetime.utcnow(),
            Coupon.valid_until >= datetime.utcnow()
        ).first()

        if not coupon:
            raise HTTPException(status_code=404, detail="Invalid or expired coupon")

        # Check if user has already used this coupon
        usage = db.query(CouponUsage).filter(
            CouponUsage.coupon_id == coupon.coupon_id,
            CouponUsage.user_id == user_id
        ).first()
        
        if usage:
            raise HTTPException(status_code=400, detail="Coupon already used")

        # Check usage limit
        if coupon.usage_limit and coupon.current_usage >= coupon.usage_limit:
            raise HTTPException(status_code=400, detail="Coupon usage limit reached")

        # Check minimum order value
        if order_amount < coupon.min_order_value:
            raise HTTPException(
                status_code=400,
                detail=f"Minimum order amount of ${coupon.min_order_value} required"
            )

        # Calculate discount
        if coupon.discount_type == DiscountType.PERCENTAGE:
            discount = order_amount * (coupon.discount_value / 100)
            if coupon.max_discount:
                discount = min(discount, coupon.max_discount)
        else:
            discount = min(coupon.discount_value, order_amount)

        return coupon, discount

    @staticmethod
    def record_coupon_usage(
        db: Session,
        coupon: Coupon,
        user_id: UUID,
        order_id: UUID,
        discount_amount: float
    ):
        # Create coupon usage record
        usage = CouponUsage(
            coupon_id=coupon.coupon_id,
            user_id=user_id,
            order_id=order_id,
            discount_amount=discount_amount
        )
        db.add(usage)

        # Update coupon usage count
        coupon.current_usage += 1
        
        db.commit()

    # @staticmethod
    # def create_coupon(db: Session, coupon: CouponCreate) -> Coupon:
    #     db.add(coupon)
    #     db.commit()
    #     db.refresh(coupon)
    #     return coupon