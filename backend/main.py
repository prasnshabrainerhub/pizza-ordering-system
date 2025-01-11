from fastapi import FastAPI
from app.core.database import engine, Base
from app.apis import auth, pizza, orders, coupon, toppings
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Pizza Ordering System")

allowed_origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/api", tags=["authentication"])
app.include_router(pizza.router, prefix="/api", tags=["pizzas"])
app.include_router(orders.router, prefix="/api", tags=["orders"])
app.include_router(coupon.router, prefix="/api", tags=["coupons"])
app.include_router(toppings.router, prefix="/api", tags=["toppings"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)