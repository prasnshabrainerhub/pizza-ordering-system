from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.database import engine, Base
from app.apis import auth, pizza, orders, coupon, toppings, payment, websocket

app = FastAPI(title="Pizza Ordering System")

# Expanded CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=[
        "Content-Type",
        "Authorization",
        "Accept",
        "Origin",
        "X-Requested-With",
    ],
    expose_headers=["*"],
    max_age=600,  # Cache preflight requests for 10 minutes
)

# Rest of your configurations
Base.metadata.create_all(bind=engine)

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(auth.router, prefix="/api", tags=["authentication"])
app.include_router(pizza.router, prefix="/api", tags=["pizzas"])
app.include_router(orders.router, prefix="/api", tags=["orders"])
app.include_router(coupon.router, prefix="/api", tags=["coupons"])
app.include_router(toppings.router, prefix="/api", tags=["toppings"])
app.include_router(payment.router, prefix="/api", tags=["payment"])
app.include_router(websocket.router, prefix="/api", tags=["websocket"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)