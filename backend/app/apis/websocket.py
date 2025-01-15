from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.websocket_manager import manager
from app.core.security import get_current_user_ws
import jwt

router = APIRouter()

import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@router.websocket("/ws/orders")
async def websocket_endpoint(websocket: WebSocket):
    logger.debug("=== WebSocket Connection Attempt ===")
    logger.debug(f"Headers: {websocket.headers}")
    logger.debug(f"Query params: {websocket.query_params}")
    
    token = websocket.query_params.get("token")
    if not token:
        logger.error("No token in query params")
        return
        
    logger.debug("About to accept connection")
    try:
        # Accept connection BEFORE token verification
        await websocket.accept()
        logger.debug("Connection accepted")
        
        # Now verify the token
        user_id = await get_current_user_ws(token)
        logger.debug(f"User authentication result: {user_id}")
        
        if not user_id:
            logger.error("Authentication failed")
            await websocket.close(code=4003)
            return
            
        logger.debug(f"Authenticated user: {user_id}")
        await manager.connect(websocket, str(user_id))
        
        # Keep connection alive
        while True:
            data = await websocket.receive_text()
            logger.debug(f"Received: {data}")
            
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}", exc_info=True)
        try:
            await websocket.close(code=4000)
        except:
            pass