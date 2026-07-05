import os
import hmac
import hashlib
import base64
import json
from datetime import datetime
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from db_models import UserModel

SECRET_KEY = os.getenv("JWT_SECRET", "f12bceed1b75191455cf74501039aac460ee26bfe412f02c94790d994f26f194")

security = HTTPBearer()

def _b64decode(s: str) -> bytes:
    padding = 4 - len(s) % 4
    return base64.urlsafe_b64decode(s + "=" * padding)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        parts = token.split(".")
        if len(parts) != 3:
            raise credentials_exception
        header, body, sig = parts
        sig_input = f"{header}.{body}".encode()
        expected = hmac.new(SECRET_KEY.encode(), sig_input, hashlib.sha256).digest()
        
        if not hmac.compare_digest(base64.urlsafe_b64encode(expected).rstrip(b"=").decode(), sig):
            raise credentials_exception
            
        payload = json.loads(_b64decode(body))
        
        if datetime.fromisoformat(payload["exp"]) < datetime.utcnow():
            raise credentials_exception
            
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
            
    except Exception:
        raise credentials_exception
        
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if user is None:
        raise credentials_exception
        
    return {"id": user.id, "email": user.email, "name": user.name}