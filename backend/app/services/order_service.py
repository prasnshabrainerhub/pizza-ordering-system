from fastapi import HTTPException
from typing import List
import uuid
from sqlalchemy.orm import Session
from app.models.models import User, Order, OrderItem, OrderStatus, Pizza, Topping, PizzaSizeEnum
from app.schema.order import OrderCreate
from app.services.coupon_services import CouponService
from app.services.notification_service import notify_user
from app.core.database import get_db

class OrderService:
    @staticmethod
    def get_user_orders(db: Session, user_id: uuid.UUID) -> List[Order]:
        return db.query(Order).filter(Order.user_id == user_id).all()
    
    @staticmethod
    def get_user_order_by_id(db: Session, user_id: uuid.UUID, order_id: uuid.UUID) -> Order:
        return db.query(Order).filter(Order.user_id == user_id, Order.order_id == order_id).first()


    @staticmethod
    def create_order(
        db: Session,
        order: OrderCreate,
        user_id: uuid.UUID
    ) -> Order:
        try:
            # Create main order
            db_order = Order(
                user_id=user_id,
                total_amount=order.total_amount,
                delivery_address=order.delivery_address,
                contact_number=order.contact_number,
                status=OrderStatus.RECEIVED,
            )
            db.add(db_order)
            db.flush()  # Flush to get the order_id

            # Create order items
            for item in order.order_items:
                if item.pizza_id:  # Only create item if pizza_id exists
                    db_item = OrderItem(
                        order_id=db_order.order_id,
                        pizza_id=item.pizza_id,
                        quantity=item.quantity,
                        size=item.size,
                        custom_toppings=[t for t in item.custom_toppings if t is not None]
                    )
                    db.add(db_item)

            db.commit()
            db.refresh(db_order)

            # Notify user if email exists
            user = db.query(User).filter(User.user_id == user_id).first()
            if user and user.email:
                notify_user(email=user.email, phone_number=user.phone_number)

            return db_order

        except ValueError as ve:
            db.rollback()
            raise HTTPException(status_code=422, detail="Invalid UUID format")
        except Exception as e:
            db.rollback()
            print(f"Error creating order: {str(e)}")  # Log the error
            raise HTTPException(status_code=500, detail=str(e))  

    def handle_successful_payment(payment_intent, db: Session):
    # Update order status in database
        db = next(get_db())
        try:
            order = db.query(Order).filter(
                Order.order_id == payment_intent.metadata.get('order_id')
            ).first()
            if order:
                order.payment_status = 'COMPLETED'
                db.commit()
        except Exception as e:
            db.rollback()
            raise e
