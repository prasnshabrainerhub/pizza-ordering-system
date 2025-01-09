from pydantic import BaseModel, UUID4
from typing import List, Optional
from app.models.models import PizzaSizeEnum

class ToppingBase(BaseModel):
    name: str
    price: float

class ToppingCreate(ToppingBase):
    pass

class ToppingResponse(ToppingBase):
    topping_id: UUID4

    class Config:
        from_attributes = True

class PizzaBase(BaseModel):
    name: str
    description: Optional[str] = None
    base_price: float

class PizzaSizeCreate(BaseModel):
    size: PizzaSizeEnum
    price: float

class PizzaCreate(PizzaBase):
 sizes: List[PizzaSizeCreate]

class PizzaSizeResponse(BaseModel):
    size: PizzaSizeEnum
    price: float

class PizzaResponse(PizzaBase):
    pizza_id: UUID4
    toppings: List[ToppingResponse]
    sizes: List[PizzaSizeResponse]

    class Config:
        from_attributes = True