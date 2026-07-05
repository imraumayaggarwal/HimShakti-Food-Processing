from sqlalchemy import Column, String, Float, Integer, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class UserModel(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    products = relationship("ProductModel", back_populates="owner", cascade="all, delete-orphan")

class ProductModel(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    ingredients = Column(String, nullable=False)
    weight = Column(String, nullable=False)
    category = Column(String, default="other")
    features = Column(JSON, default=[])
    description = Column(String, nullable=True)
    tone = Column(String, default="health-focused")
    price = Column(Float, nullable=True)
    stock = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    owner = relationship("UserModel", back_populates="products")