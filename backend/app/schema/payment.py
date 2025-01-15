from pydantic import BaseModel
from enum import Enum


class PaymentIntentRequest(BaseModel):
    amount: float

class PaymentMethod(str, Enum):
    CASH = "CASH"
    ONLINE = "ONLINE"

class PaymentStatus(str, Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"