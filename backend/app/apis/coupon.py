from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Coupon, CouponUsage
from app.schema.coupon import CouponCreate, CouponResponse
from app.core.security import JWTBearer
from app.core.config import settings
from uuid import UUID
from datetime import datetime
from app.models.models import UserRole
import jwt

router = APIRouter()

@router.get("/coupons")
def get_coupons(db: Session = Depends(get_db)):
    return db.query(Coupon).all()

@router.post("/coupons", response_model=CouponResponse)
def create_coupon(
    coupon: CouponCreate,
    db: Session = Depends(get_db),
    token: str = Depends(JWTBearer())
):
    # Verify admin role
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    if payload.get("role") != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can create coupons")
    
    db_coupon = Coupon(**coupon.model_dump())
    db.add(db_coupon)
    db.commit()
    db.refresh(db_coupon)
    return db_coupon

@router.get("/coupons/validate/{code}")
def validate_coupon(
    code: str,
    db: Session = Depends(get_db),
    token: str = Depends(JWTBearer())
):
    user_id = UUID(jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])["sub"])
    coupon = db.query(Coupon).filter(
        Coupon.code == code,
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
        
    return {
        "valid": True,
        "discount_type": coupon.discount_type,
        "discount_value": coupon.discount_value,
        "min_order_value": coupon.min_order_value,
        "max_discount": coupon.max_discount
    }

@router.put("/coupons/{coupon_id}")
def update_coupon(
    coupon_id: UUID,
    coupon: CouponCreate,
    db: Session = Depends(get_db),
    token: str = Depends(JWTBearer())
):
    # Verify admin role
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    if payload.get("role") != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can update coupons")
    
    db_coupon = db.query(Coupon).filter(Coupon.coupon_id == coupon_id).first()
    if not db_coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")
    db_coupon.code = coupon.code
    db_coupon.discount_type = coupon.discount_type
    db_coupon.discount_value = coupon.discount_value
    db_coupon.description = coupon.description
    db_coupon.valid_from = coupon.valid_from
    db_coupon.valid_until = coupon.valid_until
    db_coupon.min_order_value = coupon.min_order_value
    db_coupon.max_discount = coupon.max_discount
    db_coupon.usage_limit = coupon.usage_limit
    db.commit()
    db.refresh(db_coupon)
    return db_coupon

@router.delete("/coupons/{coupon_id}")
def delete_coupon(
    coupon_id: UUID,
    db: Session = Depends(get_db),
    token: str = Depends(JWTBearer())
):
    # Verify admin role
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    if payload.get("role") != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can delete coupons")
    
    db_coupon = db.query(Coupon).filter(Coupon.coupon_id == coupon_id).first()
    if not db_coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")
    db.delete(db_coupon)
    db.commit()
    return {"message": "Coupon deleted successfully"}