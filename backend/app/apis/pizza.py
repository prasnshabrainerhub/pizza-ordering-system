from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.models import UserRole, PizzaCategory
from app.core.database import get_db
from app.schema.pizza import  PizzaUpdate
from app.services.pizza_services import PizzaService
from app.core.security import JWTBearer
from utils import serialize_response
import jwt
import uuid
import json
import os

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
    sizes: str = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    token: str = Depends(JWTBearer())
):
    try:
        # Save the uploaded image file
        image_path = None
        if image:
            content = await image.read()
            os.makedirs("static/pizza_images", exist_ok=True)
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

        # Prepare response data with serialization
        response_data = {
            "message": "Pizza created successfully",
            "data": {
                "id": str(db_pizza.pizza_id),  # Convert UUID to string
                "name": db_pizza.name,
                "description": db_pizza.description,
                "base_price": db_pizza.base_price,
                "category": db_pizza.category,
                "image_path": db_pizza.image_url,
                "sizes": [
                    {
                        "size": size.size.value,
                        "price": size.price
                    } 
                    for size in db_pizza.sizes
                ]
            }
        }

        return JSONResponse(
            content=serialize_response(response_data),
            status_code=201
        )
    except Exception as e:
        print("Error creating pizza:", str(e))
        raise HTTPException(status_code=400, detail=str(e))

# Add a new endpoint to get available categories
@router.get("/categories")
async def get_categories():
    return {
        "categories": [
            {
                "id": category.value,
                "name": category.name,
                "icon": get_category_icon(category)  # You can create a mapping function for icons
            }
            for category in PizzaCategory
        ]
    }

def get_category_icon(category: PizzaCategory) -> str:
    icon_mapping = {
        PizzaCategory.BUY1GET4: "🍕",
        PizzaCategory.VEG_PIZZA: "🍕",
        PizzaCategory.NON_VEG: "🥩",
        PizzaCategory.CLASSIC_MANIA: "🏆",
        PizzaCategory.DRINKS: "🍹",
    }
    return icon_mapping.get(category, "🍕")
    
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
    
    updated_pizza = PizzaService.update_pizza(db, pizza_id, pizza_update)
    # Convert to dict and include all necessary fields
    return {
        "message": "Pizza updated successfully",
        "pizza": {
            "pizza_id": str(updated_pizza.pizza_id),
            "name": updated_pizza.name,
            "description": updated_pizza.description,
            "base_price": updated_pizza.base_price,
            "category": updated_pizza.category,
            "sizes": updated_pizza.sizes,
            "image_url": updated_pizza.image_url
        }
    }

@router.delete("/pizzas/{pizza_id}")
def delete_pizza(
    pizza_id: uuid.UUID,  # FastAPI will automatically validate and parse this
    db: Session = Depends(get_db),
    token: str = Depends(JWTBearer())
) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("role") != UserRole.ADMIN:
            raise HTTPException(status_code=403, detail="Only admins can delete pizzas")
        
        PizzaService.delete_pizza(db, pizza_id)
        return {"message": "Pizza deleted successfully"}
        
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")