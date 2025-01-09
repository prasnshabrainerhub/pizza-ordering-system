from fastapi import FastAPI
from app.core.database import engine, Base
from app.apis import auth, pizza, orders, coupon
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Pizza Ordering System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/api", tags=["authentication"])
app.include_router(pizza.router, prefix="/api", tags=["pizzas"])
app.include_router(orders.router, prefix="/api", tags=["orders"])
app.include_router(coupon.router, prefix="/api", tags=["coupons"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)