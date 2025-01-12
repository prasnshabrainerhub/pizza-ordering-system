from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.models import UserRole
from app.core.database import get_db
from app.schema.pizza import  PizzaUpdate
from app.services.pizza_services import PizzaService
from app.core.security import JWTBearer
import jwt
import uuid
import json
import os
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/pizzas")
def get_pizzas(db: Session = Depends(get_db)):
    return PizzaService.get_pizzas(db)

@router.post("/pizzas")
async def create_pizza(
    name: str = Form(...),
    description: str = Form(""),
    base_price: float = Form(...),
    category: str = Form(...),
    sizes: str = Form(...),  # Note: Changed from List[str] to str since we're sending JSON string
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    token: str = Depends(JWTBearer())
):
    try:
        # Save the uploaded image file
        image_path = None
        if image:
            # Read file content
            content = await image.read()
            
            # Create directory if it doesn't exist
            os.makedirs("static/pizza_images", exist_ok=True)
            
            # Define file path
            image_path = f"static/pizza_images/{image.filename}"
            with open(image_path, "wb") as f:
                f.write(content)

        # Parse sizes JSON string
        try:
            sizes_data = json.loads(sizes)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid sizes data format")

        # Create pizza in database using the service method
        db_pizza = PizzaService.create_pizza(
            name=name,
            description=description,
            base_price=base_price,
            category=category,
            sizes=sizes,
            image=image_path,
            db=db
        )

        # Return the created pizza data
        return JSONResponse(
            content={
                "message": "Pizza created successfully",
                "data": {
                    "id": db_pizza.pizza_id,
                    "name": db_pizza.name,
                    "description": db_pizza.description,
                    "base_price": db_pizza.base_price,
                    "category": db_pizza.category,
                    "image_path": db_pizza.image_url,
                    "sizes": [{"size": size.size.value, "price": size.price} for size in db_pizza.sizes]
                }
            },
            status_code=201
        )
    except Exception as e:
        # Handle any errors
        print("Error creating pizza:", str(e))
        raise HTTPException(status_code=400, detail=str(e))
    
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