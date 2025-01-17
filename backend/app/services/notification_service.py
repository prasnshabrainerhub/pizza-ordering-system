import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv
import uuid
from twilio.rest import Client

load_dotenv()

SMTP_SERVER = os.getenv('SMTP_SERVER')
SMTP_PORT = os.getenv('SMTP_PORT')
SENDER_EMAIL = os.getenv('SENDER_EMAIL')
SENDER_PASSWORD = os.getenv('SENDER_PASSWORD')
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')


def send_order_confirmation_email(recipient_email: str, order_id: uuid.UUID):
    subject = "🍕 Order Confirmation from PizzaBliss"
    body = (
        f"Hi there,\n\n"
        f"Thank you for ordering with PizzaBliss! Your order ID is {order_id}.\n"
        f"Your order will be ready in approximately 30 minutes.\n\n"
        f"If you have any questions or need to make changes to your order, feel free to contact us at [Contact Number] "
        f"or reply to this email.\n\n"
        f"Thank you for choosing PizzaBliss, where every slice is a delight! 🍕\n\n"
        f"Best regards,\n"
        f"The PizzaBliss Team!"
    )

    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = recipient_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, recipient_email, msg.as_string())
            print(f"Confirmation email sent to {recipient_email}")
    except Exception as e:
        print(f"Failed to send confirmation email to {recipient_email}: {e}")

def send_order_confirmation_sms(to_number: str, message: str):
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    try:
        message = client.messages.create(
            body=message,
            from_=TWILIO_PHONE_NUMBER,
            to=to_number
        )
        print(f"SMS sent successfully: {message.sid}")
    except Exception as e:
        print(f"Failed to send SMS: {e}")

def notify_user(email: str, phone_number: str, order_id: uuid.UUID):
    email_subject = "🍕 Order Confirmation from PizzaBliss"
    email_body =( f"Hi there,\n\n"
        f"Thank you for ordering with PizzaBliss! Your order ID is {order_id}.\n"
        f"Your order will be ready in approximately 30 minutes.\n\n"
        f"If you have any questions or need to make changes to your order, feel free to contact us at [Contact Number] "
        f"or reply to this email.\n\n"
        f"Thank you for choosing PizzaBliss, where every slice is a delight! 🍕\n\n"
        f"Best regards,\n"
        f"The PizzaBliss Team!")
    
    send_order_confirmation_email(recipient_email=email, order_id=uuid.uuid4())
    
    sms_message = "Thank you for your order! Your order has been successfully placed."
    send_order_confirmation_sms(to_number=phone_number, message=sms_message)