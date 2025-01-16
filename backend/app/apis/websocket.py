# Backend (FastAPI) - websocket.py
from fastapi import APIRouter, WebSocket, HTTPException, Query, WebSocketDisconnect
from typing import List, Dict
import asyncio
import json
from datetime import datetime
from jwt import decode, InvalidTokenError

router = APIRouter()

# Store active WebSocket connections
active_connections: List[WebSocket] = []

# Store order statuses
order_statuses = {
    0: "received",
    1: "being baked",
    2: "dispatched",
    3: "delivered"
}

async def verify_token(token: str) -> bool:
    try:
        # Use the same JWT_SECRET from your auth configuration
        JWT_SECRET = "your-secret-key"  # Move this to environment variables in production
        decode(token, JWT_SECRET, algorithms=["HS256"])
        return True
    except InvalidTokenError:
        return False

async def broadcast_status_update(status_data: dict):
    """Broadcast status update to all connected clients"""
    for connection in active_connections:
        try:
            await connection.send_json(status_data)
        except:
            pass

async def update_order_status(order_id: str):
    """Automatically update order status every minute"""
    current_status = 0
    
    while current_status < len(order_statuses):
        status_data = {
            "order_id": order_id,
            "status": order_statuses[current_status],
            "update_time": datetime.now().isoformat()
        }
        
        await broadcast_status_update(status_data)
        await asyncio.sleep(60)
        current_status += 1

@router.websocket("/ws/orders")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str = Query(...)  # Required query parameter
):
    if not await verify_token(token):
        await websocket.close(code=4001, reason="Invalid token")
        return

    await websocket.accept()
    active_connections.append(websocket)
    
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        active_connections.remove(websocket)
    except Exception:
        if websocket in active_connections:
            active_connections.remove(websocket)

@router.post("/api/orders/{order_id}/start-tracking")
async def start_order_tracking(order_id: str):
    asyncio.create_task(update_order_status(order_id))
    return {"message": "Order tracking started"}