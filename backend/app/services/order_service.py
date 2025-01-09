from fastapi import HTTPException
from typing import List
import uuid
from sqlalchemy.orm import Session
from app.models.models import User, Order, OrderItem, OrderStatus, Pizza, Topping
from app.schema.order import OrderCreate
from app.services.coupon_services import CouponService
from app.services.notification_service import notify_user

class OrderService:
    @staticmethod
    def get_user_orders(db: Session, user_id: uuid.UUID) -> List[Order]:
        return db.query(Order).filter(Order.user_id == user_id).all()

    @staticmethod
    def create_order(db: Session, order: OrderCreate, user_id: uuid.UUID) -> Order:
        total_amount = 0
        order_items = []

        for item in order.items:
            pizza = db.query(Pizza).filter(Pizza.pizza_id == item.pizza_id).first()
            if not pizza:
                raise HTTPException(status_code=404, detail="Pizza not found")
            
            item_price = pizza.base_price
            
            custom_toppings = []
            
            for topping_id in item.custom_toppings:
                topping = db.query(Topping).filter(Topping.topping_id == topping_id).first()
                if not topping:
                    raise HTTPException(status_code=404, detail="Topping not found")
                item_price += topping.price  
                custom_toppings.append(topping)

            total_item_price = item_price * item.quantity
            total_amount += total_item_price 

            order_items.append({
                "pizza_id": pizza.pizza_id,
                "quantity": item.quantity,
                "pizza_size": item.pizza_size,
                "custom_toppings": [str(t.topping_id) for t in custom_toppings],
                "item_price": total_item_price
            })

        if not order.contact_number:
            raise HTTPException(status_code=400, detail="Contact number is required")

        # Apply coupon if provided
        coupon = None
        discount_amount = 0
        if order.coupon_code:
            coupon, discount_amount = CouponService.validate_and_apply_coupon(
                db, order.coupon_code, user_id, total_amount
            )
            total_amount -= discount_amount

        db_order = Order(
            user_id=user_id,
            total_amount=total_amount,
            delivery_address=order.delivery_address,
            notes=order.notes,
            contact_number=order.contact_number,
            coupon_id=coupon.coupon_id if coupon else None,
            discount_amount=discount_amount
        )
        db.add(db_order)
        db.flush()

        for item in order_items:
            db_item = OrderItem(
                order_id=db_order.order_id,
                **item
            )
            db.add(db_item)

        if coupon:
            CouponService.record_coupon_usage(
                db, coupon, user_id, db_order.order_id, discount_amount
            )

        db.commit()
        db.refresh(db_order)

        user = db.query(User).filter(User.user_id == user_id).first()
        if user and user.email:
            notify_user(email=user.email, phone_number=user.phone_number)

        return db_order


    @staticmethod
    def update_order_status(db: Session, order_id: uuid.UUID, status: OrderStatus) -> Order:
        order = db.query(Order).filter(Order.order_id == order_id).first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        order.status = status
        db.commit()
        db.refresh(order)
        return order
