from fastapi import APIRouter, HTTPException, Request, Depends
from typing import Optional
from sqlalchemy.orm import Session
import stripe
import os
import jwt
from uuid import UUID
from dotenv import load_dotenv
from app.services.order_service import OrderService
from app.schema.order import PaymentLinkRequest
from app.core.security import JWTBearer
from app.core.config import settings
from app.core.database import get_db


load_dotenv()
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')

router = APIRouter()

@router.post("/create-payment-link")
def create_payment_link(
    request: PaymentLinkRequest,
    db: Session = Depends(get_db),
    token: str = Depends(JWTBearer())
):
    try:
        # Decode JWT token to get user_id
        decoded_token = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
        user_id = UUID(decoded_token["sub"])
        
        # Convert PaymentLinkRequest to OrderCreate
        order_create = request.to_order_create()
        
        # Create order using OrderService
        order = OrderService.create_order(
            db=db,
            order=order_create,
            user_id=user_id
        )

        # First, create a product
        product = stripe.Product.create(
            name=f'Order #{order.order_id}',
            description='Pizza Bliss Order'
        )

        # Then create a price for the product
        price = stripe.Price.create(
            product=product.id,
            unit_amount=int(request.amount * 100),
            currency='inr',
        )

        # Create Stripe Payment Link with the price ID
        payment_link = stripe.PaymentLink.create(
            line_items=[{
                'price': price.id,
                'quantity': 1
            }],
            after_completion={
                'type': 'redirect',
                'redirect': {
                    'url': f"{FRONTEND_URL}/order-success?order_id={order.order_id}"
                }
            },
            payment_method_types=['card'],
            metadata={
                'order_id': str(order.order_id)
            }
        )
        return {"url": payment_link.url}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e.user_message))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

def get_payment_config(payment_type: str) -> Optional[str]:
    """
    Returns the appropriate payment method configuration based on payment type.
    You'll need to create these configurations in your Stripe Dashboard.
    """
    config_map = {
        'upi': 'pmc_upi',  # Configuration for UPI
        'wallet': 'pmc_wallet',  # Configuration for wallets
        'netbanking': 'pmc_netbanking',  # Configuration for net banking
        'bank_transfer': 'pmc_banktransfer',  # Configuration for bank transfers
    }
    return config_map.get(payment_type)

@router.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.getenv('STRIPE_WEBHOOK_SECRET')
        )
        
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            # Extract order ID from metadata or custom fields
            order_id = session.get('metadata', {}).get('order_id')
            if order_id:
                await OrderService.update_order_status(
                    order_id=order_id,
                    payment_status="COMPLETED",
                    transaction_id=session.payment_intent
                )
            
        return {"status": "success"}
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))