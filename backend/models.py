from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List


#Product Models
class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    ingredients: str = Field(..., min_length=1)
    weight: str = Field(..., min_length=1)
    category: str = Field(default="other")
    features: List[str] = Field(default=[])
    description: Optional[str] = None
    tone: Optional[str] = "health-focused"
    price: Optional[float] = None
    stock: Optional[int] = 0


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    ingredients: Optional[str] = None
    weight: Optional[str] = None
    category: Optional[str] = None
    features: Optional[List[str]] = None
    description: Optional[str] = None
    tone: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None


# Generate Model 
class GenerateRequest(BaseModel):
    product_name: str = Field(..., min_length=1)
    ingredients: str = Field(..., min_length=1)
    weight: str = Field(..., min_length=1)
    features: List[str] = Field(default=[])
    tone: str = Field(default="health-focused")  # premium | traditional | health-focused


# Auth Models 
class SignupRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=80)
    email: str = Field(..., min_length=5)
    password: str = Field(..., min_length=6)


class LoginRequest(BaseModel):
    email: str = Field(..., min_length=5)
    password: str = Field(..., min_length=1)


class AuthResponse(BaseModel):
    token: str
    user: dict