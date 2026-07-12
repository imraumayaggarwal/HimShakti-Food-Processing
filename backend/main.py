import os
import hashlib
import hmac
import base64
import json
import uuid
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from sqlalchemy import text

from database import engine, get_db, Base
from db_models import UserModel
import db_models  
from models import SignupRequest, LoginRequest
from routes.products import router as products_router
from routes.generate import router as generate_router
from auth import get_current_user

# Add these imports to the top of backend/main.py
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request

# Configure global API rate limiter tracking via Client IP
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="HimShakti API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

load_dotenv()

Base.metadata.create_all(bind=engine)

SECRET_KEY = os.getenv("JWT_SECRET", "f12bceed1b75191455cf74501039aac460ee26bfe412f02c94790d994f26f194")

app = FastAPI(
    title="HimShakti API",
    description="Backend API for HimShakti Food Processing D2C Platform",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products_router)
app.include_router(generate_router)

def _b64encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()

def create_token(payload: dict, expires_hours: int = 72) -> str:
    header = _b64encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode())
    payload["exp"] = (datetime.utcnow() + timedelta(hours=expires_hours)).isoformat()
    body = _b64encode(json.dumps(payload).encode())
    sig_input = f"{header}.{body}".encode()
    sig = hmac.new(SECRET_KEY.encode(), sig_input, hashlib.sha256).digest()
    return f"{header}.{body}.{_b64encode(sig)}"

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


@app.post("/api/auth/signup", status_code=201)
def signup(body: SignupRequest, db: Session = Depends(get_db)):
    email = body.email.lower().strip()

    existing = db.query(UserModel).filter(
        UserModel.email == email
    ).first()

    if existing:
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists"
        )

    new_user_id = str(uuid.uuid4())

    user = UserModel(
        id=new_user_id,
        email=email,
        name=body.name,
        hashed_password=hash_password(body.password),
        created_at=datetime.utcnow(),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_token(
        {
            "sub": user.id,
            "email": email,
            "name": body.name,
        }
    )

    return {
        "token": token,
        "user": {
            "id": user.id,
            "email": email,
            "name": body.name,
        },
    }

@app.post("/api/auth/login", status_code=200)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    email = body.email.lower().strip()
    user = db.query(UserModel).filter(UserModel.email == email).first()
    
    if not user or user.hashed_password != hash_password(body.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    token = create_token({"sub": user.id, "email": email, "name": user.name})
    return {"token": token, "user": {"id": user.id, "email": email, "name": user.name}}

@app.get("/api/auth/me", status_code=200)
def me(current_user: dict = Depends(get_current_user)):
    return current_user

@app.post("/api/auth/signup", status_code=201)
@limiter.limit("5/15minutes")
def signup(request: Request, body: SignupRequest, db: Session = Depends(get_db)):
    # ... your existing signup code ...
    pass

@app.post("/api/auth/login", status_code=200)
@limiter.limit("5/15minutes")
def login(request: Request, body: LoginRequest, db: Session = Depends(get_db)):
    # ... your existing login code ...
    pass

@app.get("/")
def root():
    return {"status": "ok", "service": "HimShakti API", "version": "2.0.0"}