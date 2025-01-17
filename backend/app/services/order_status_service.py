from threading import Thread
import time
from sqlalchemy.orm import Session
from uuid import UUID
from sqlalchemy import update
from datetime import datetime
from typing import Dict
from app.models.models import Order, OrderStatus

class OrderStatusService:
    _status_sequence = [
        OrderStatus.RECEIVED,
        OrderStatus.PREPARING,
        OrderStatus.BAKING,
        OrderStatus.READY,
        OrderStatus.DELIVERED
    ]
    _active_orders: Dict[str, Thread] = {}

    @classmethod
    def start_status_updates(cls, db: Session, order_id: UUID):
        def update_status():
            try:
                current_status_idx = 0
                
                while current_status_idx < len(cls._status_sequence):
                    from app.core.database import SessionLocal
                    thread_db = SessionLocal()
                    
                    try:
                        order = thread_db.query(Order).filter(Order.order_id == order_id).first()
                        if not order:
                            break
                        
                        new_status = cls._status_sequence[current_status_idx]
                        
                        # Update the order directly instead of using raw SQL
                        order.status = new_status
                        order.updated_at = datetime.utcnow()
                        thread_db.commit()
                        
                        print(f"Updated order {order_id} status to: {new_status}")
                        
                        if new_status == OrderStatus.DELIVERED:
                            break
                        
                        current_status_idx += 1
                        time.sleep(5)
                        
                    except Exception as e:
                        print(f"Error updating status: {str(e)}")
                        thread_db.rollback()
                    finally:
                        thread_db.close()
                        
            except Exception as e:
                print(f"Error in status update thread: {str(e)}")
            finally:
                if str(order_id) in cls._active_orders:
                    del cls._active_orders[str(order_id)]
        
        thread = Thread(target=update_status, daemon=True)
        cls._active_orders[str(order_id)] = thread
        thread.start()
        print(f"Started status update thread for order: {order_id}")