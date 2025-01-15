from fastapi import APIRouter, HTTPException, Request
import stripe
from datetime import datetime
import os
from dotenv import load_dotenv
from app.services.order_service import OrderService
from app.schema.payment import PaymentIntentRequest


load_dotenv()
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

router = APIRouter()


@router.post("/create-payment-intent")
async def create_payment_intent(payment: PaymentIntentRequest):
    try:
        intent = stripe.PaymentIntent.create(
            amount=int(payment.amount * 100),  # Convert to cents
            currency="inr",
            payment_method_types=["card", "upi"],
            metadata={
                "integration_check": "accept_a_payment",
            }
        )
        return {"clientSecret": intent.client_secret}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.getenv('STRIPE_WEBHOOK_SECRET')
        )
        
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            # Update order status in database
            OrderService.handle_successful_payment(payment_intent)
            
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

