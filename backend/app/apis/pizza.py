from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.models import UserRole
from app.core.database import get_db
from app.schema.pizza import PizzaCreate, PizzaUpdate, PizzaSizeCreate
from app.services.pizza_services import PizzaService
from app.core.security import JWTBearer
import jwt
import uuid
import os
import json

router = APIRouter()

@router.get("/pizzas")
def get_pizzas(db: Session = Depends(get_db)):
    return PizzaService.get_pizzas(db)

@router.post("/pizzas")
async def create_pizza(
    name: str = Form(...),
    description: str = Form(None),
    base_price: float = Form(...),
    category: str = Form(...),
    sizes: str = Form(...),  # JSON string of sizes
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    token: str = Depends(JWTBearer())
):
    # Check admin role
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    if payload.get("role") != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can create pizzas")
    
    # Parse sizes from JSON string
    try:
        sizes_data = json.loads(sizes)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid sizes data")

    # Handle image upload
    file_location = f"static/pizza_images/{uuid.uuid4()}{os.path.splitext(image.filename)[1]}"
    with open(file_location, "wb+") as file_object:
        file_object.write(await image.read())

    # Create pizza data
    pizza_data = PizzaCreate(
        name=name,
        description=description,
        base_price=base_price,
        category=category,
        sizes=[PizzaSizeCreate(**size) for size in sizes_data],
        image_url=file_location  # Save the file path
    )

    return PizzaService.create_pizza(db, pizza_data)

@router.put("/pizzas/{pizza_id}")
def update_pizza(
    pizza_id: uuid.UUID,
    pizza_update: PizzaUpdate,
    db: Session = Depends(get_db),
    token: str = Depends(JWTBearer())
):
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    if payload.get("role") != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can update pizzas")
    return PizzaService.update_pizza(db, pizza_id, pizza_update)

@router.delete("/pizzas/{pizza_id}")
def delete_pizza(
    pizza_id: uuid.UUID,
    db: Session = Depends(get_db),
    token: str = Depends(JWTBearer())
):
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    if payload.get("role") != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can delete pizzas")
    PizzaService.delete_pizza(db, pizza_id)