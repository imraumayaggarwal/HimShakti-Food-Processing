from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional
from datetime import datetime
import uuid

from models import ProductCreate, ProductUpdate
from database import get_db
from db_models import ProductModel
from auth import get_current_user 

router = APIRouter(prefix="/api/products", tags=["products"])

def _serialize(p: ProductModel) -> dict:
    """Convert ORM object to plain dict for JSON response."""
    return {
        "id":          p.id,
        "name":        p.name,
        "ingredients": p.ingredients,
        "weight":      p.weight,
        "category":    p.category,
        "features":    p.features or [],
        "description": p.description,
        "tone":        p.tone,
        "price":       p.price,
        "stock":       p.stock,
        "created_at":  p.created_at.isoformat() if p.created_at else None,
    }

@router.get("", status_code=200)
def list_products(
    db: Session = Depends(get_db), 
    current_user: dict = Depends(get_current_user)
):
    products = (
        db.query(ProductModel)
        .filter(ProductModel.user_id == current_user["id"])
        .order_by(ProductModel.created_at.desc())
        .all()
    )
    return {"products": [_serialize(p) for p in products], "total": len(products)}

@router.get("/search/query", status_code=200)
def search_products(
    q: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    query = db.query(ProductModel).filter(ProductModel.user_id == current_user["id"])
    if q:
        query = query.filter(
            or_(
                ProductModel.name.ilike(f"%{q}%"),
                ProductModel.ingredients.ilike(f"%{q}%"),
            )
        )
    if category:
        query = query.filter(ProductModel.category.ilike(category))

    results = query.all()
    if not results:
        raise HTTPException(status_code=404, detail="No products match your search")
    return {"products": [_serialize(p) for p in results], "total": len(results)}

@router.get("/{product_id}", status_code=200)
def get_product(
    product_id: str, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    p = db.query(ProductModel).filter(
        ProductModel.id == product_id, 
        ProductModel.user_id == current_user["id"]
    ).first()
    
    if not p:
        raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found")
    return _serialize(p)

@router.post("", status_code=201)
def create_product(
    body: ProductCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    new_id = "p" + str(uuid.uuid4())[:8]

    p = ProductModel(
        id=new_id,
        name=body.name,
        ingredients=body.ingredients,
        weight=body.weight,
        category=body.category,
        features=body.features,
        description=body.description,
        tone=body.tone,
        price=body.price,
        stock=body.stock,
        created_at=datetime.utcnow(),
        user_id=current_user["id"],
    )

    db.add(p)
    db.commit()
    db.refresh(p)
    
    return _serialize(p)

@router.put("/{product_id}", status_code=200)
def update_product(
    product_id: str, 
    body: ProductUpdate, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    p = db.query(ProductModel).filter(
        ProductModel.id == product_id, 
        ProductModel.user_id == current_user["id"]
    ).first()
    
    if not p:
        raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found")
        
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    for key, val in updates.items():
        setattr(p, key, val)
    db.commit()
    db.refresh(p)
    return _serialize(p)

@router.delete("/{product_id}", status_code=204)
def delete_product(
    product_id: str, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    p = db.query(ProductModel).filter(
        ProductModel.id == product_id, 
        ProductModel.user_id == current_user["id"]
    ).first()
    
    if not p:
        raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found")
    db.delete(p)
    db.commit()
    return None