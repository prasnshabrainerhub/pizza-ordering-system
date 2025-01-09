from pydantic import BaseModel, UUID4

class ToppingBase(BaseModel):
    name: str
    price: float

class ToppingCreate(ToppingBase):
    pass

class ToppingUpdate(ToppingBase):
    pass

class ToppingResponse(ToppingBase):
    topping_id: UUID4

    class Config:
        from_attributes = True