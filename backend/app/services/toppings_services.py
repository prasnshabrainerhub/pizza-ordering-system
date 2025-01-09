from fastapi import HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models.models import Topping
from app.schema.toppings import ToppingCreate, ToppingUpdate
import uuid

class ToppingService:
    @staticmethod
    def get_toppings(db: Session) -> List[Topping]:
        return db.query(Topping).all()

    @staticmethod
    def create_topping(db: Session, topping: ToppingCreate) -> Topping:
        db_topping = Topping(**topping.dict())
        db.add(db_topping)
        db.commit()
        db.refresh(db_topping)
        return db_topping
    
    @staticmethod
    def update_topping(db: Session, topping_id: uuid.UUID, topping: ToppingUpdate) -> Topping:
        db_topping = db.query(Topping).filter(Topping.topping_id == topping_id).first()
        if not db_topping:
            raise HTTPException(status_code=404, detail="Topping not found")
        
        db_topping.name = topping.name
        db_topping.price = topping.price
        db.commit()
        db.refresh(db_topping)
        return db_topping
    
    @staticmethod
    def delete_topping(db: Session, topping_id: uuid.UUID) -> None:
        db_topping = db.query(Topping).filter(Topping.topping_id == topping_id).first()
        if not db_topping:
            raise HTTPException(status_code=404, detail="Topping not found")
        
        db.delete(db_topping)
        db.commit()