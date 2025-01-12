from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.models import Pizza, PizzaSize, PizzaSizeEnum
from app.schema.pizza import PizzaUpdate
from typing import List
import uuid
import json
import os



class PizzaService:
    @staticmethod
    def get_pizzas(db: Session) -> List[Pizza]:
        return db.query(Pizza).all()

    @staticmethod
    def create_pizza(name: str, description: str, base_price: float, category: str, sizes: str, image: str, db: Session):
    # Parse sizes
        try:
            sizes_data = json.loads(sizes)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid sizes data format")

        # Validate size enum values
        for size_data in sizes_data:
            if size_data["size"] not in [e.value for e in PizzaSizeEnum]:
                raise HTTPException(status_code=400, detail=f"Invalid size value: {size_data['size']}")

        # Create pizza
        db_pizza = Pizza(
            name=name,
            description=description,
            base_price=base_price,
            category=category,
            image_url=image  # Now passing the image path directly
        )

        # Create sizes
        db_pizza.sizes = [
            PizzaSize(
                size=PizzaSizeEnum(size_data["size"]),
                price=size_data["price"]
            )
            for size_data in sizes_data
        ]

        # Add to database
        db.add(db_pizza)
        db.commit()
        db.refresh(db_pizza)

        return db_pizza
    
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