from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt
from .config import settings
from uuid import UUID

security = HTTPBearer()

class JWTBearer:
    def __init__(self, auto_error: bool = True):
        self.auto_error = auto_error
        self.security = HTTPBearer(auto_error=auto_error)

    async def __call__(self, auth: HTTPAuthorizationCredentials = Security(security)):
        if auth:
            if not auth.scheme == "Bearer":
                raise HTTPException(status_code=403, detail="Invalid authentication scheme.")
            if not self.verify_jwt(auth.credentials):
                raise HTTPException(status_code=403, detail="Invalid token or expired token.")
            return auth.credentials
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code.")

    def verify_jwt(self, jwt_token: str) -> bool:
        try:
            payload = jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            return True if payload["expires"] >= datetime.utcnow().timestamp() else False
        except JWTError:
            return False

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"expires": expire.timestamp()})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"expires": expire.timestamp()})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

async def get_current_user_ws(token: str) -> Optional[UUID]:
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        
        user_id = payload.get("sub")
        expires = payload.get("expires")
        current_time = datetime.utcnow().timestamp()
        
        if expires and expires < current_time:
            return None
            
        return user_id
        
    except jwt.ExpiredSignatureError as e:
        return None
    except jwt.PyJWTError as e:
        return None
    except Exception as e:
        return None