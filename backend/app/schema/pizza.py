from pydantic import BaseModel, UUID4
from typing import List, Optional
from app.models.models import PizzaSizeEnum
from app.schema.toppings import ToppingResponse

class PizzaBase(BaseModel):
    name: str
    description: Optional[str] = None
    base_price: float
    category: str

class PizzaSizeCreate(BaseModel):
    size: PizzaSizeEnum
    price: float

class PizzaCreate(PizzaBase):
 sizes: List[PizzaSizeCreate]

class PizzaUpdate(PizzaBase):
    sizes: List[PizzaSizeCreate]
    pass

class PizzaSizeResponse(BaseModel):
    size: PizzaSizeEnum
    price: float

class PizzaResponse(PizzaBase):
    pizza_id: UUID4
    toppings: List[ToppingResponse]
    sizes: List[PizzaSizeResponse]

    class Config:
        from_attributes = True