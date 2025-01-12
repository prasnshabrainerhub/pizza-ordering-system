from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from app.models.models import PizzaSizeEnum

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
    size: str
    price: float

    class Config:
        from_attributes = True

class PizzaResponse(BaseModel):
    name: str
    description: Optional[str]
    base_price: float
    category: str
    image_url: str
    sizes: List[PizzaSizeResponse]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True