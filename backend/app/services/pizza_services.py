from sqlalchemy.orm import Session
from app.models.models import Pizza, Topping, PizzaSize
from app.schema.pizza import PizzaCreate, ToppingCreate
from typing import List


class PizzaService:
    @staticmethod
    def get_pizzas(db: Session) -> List[Pizza]:
        return db.query(Pizza).all()

    @staticmethod
    def create_pizza(db: Session, pizza_create: PizzaCreate) -> Pizza:
        pizza = Pizza(
        name=pizza_create.name,
        description=pizza_create.description,
        base_price=pizza_create.base_price
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
    def get_toppings(db: Session) -> List[Topping]:
        return db.query(Topping).all()

    @staticmethod
    def create_topping(db: Session, topping: ToppingCreate) -> Topping:
        db_topping = Topping(**topping.dict())
        db.add(db_topping)
        db.commit()
        db.refresh(db_topping)
        return db_topping