from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.models import Pizza, PizzaSize
from app.schema.pizza import PizzaCreate, PizzaUpdate
from typing import List
import uuid



class PizzaService:
    @staticmethod
    def get_pizzas(db: Session) -> List[Pizza]:
        return db.query(Pizza).all()

    @staticmethod
    def create_pizza(db: Session, pizza_create: PizzaCreate) -> Pizza:
        pizza = Pizza(
        name=pizza_create.name,
        description=pizza_create.description,
        base_price=pizza_create.base_price,
        category=pizza_create.category
    )
    
    # Create PizzaSize instances
        for size_data in pizza_create.sizes:
            pizza_size = PizzaSize(
                size=size_data.size,
                price=size_data.price,
                pizza=pizza
            )
            pizza.sizes.append(pizza_size)  # Append PizzaSize instance to Pizza

        db.add(pizza)
        db.commit()
        db.refresh(pizza)
        
        return pizza
    
    @staticmethod
    def update_pizza(db: Session, pizza_id: uuid.UUID, pizza_update: PizzaUpdate) -> Pizza:
        pizza = db.query(Pizza).filter(Pizza.pizza_id == pizza_id).first()
        if not pizza:
            raise HTTPException(status_code=404, detail="Pizza not found")
        
        pizza.name = pizza_update.name
        pizza.description = pizza_update.description
        pizza.base_price = pizza_update.base_price
        
        db.commit()
        db.refresh(pizza)
        return pizza
    
    @staticmethod
    def delete_pizza(db: Session, pizza_id: uuid.UUID) -> None:
        pizza = db.query(Pizza).filter(Pizza.pizza_id == pizza_id).first()
        if not pizza:
            raise HTTPException(status_code=404, detail="Pizza not found")
        
        db.delete(pizza)
        db.commit()