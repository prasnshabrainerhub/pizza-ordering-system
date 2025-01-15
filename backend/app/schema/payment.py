from pydantic import BaseModel


class PaymentIntentRequest(BaseModel):
    amount: float