"""
HimShakti Food Processing — FastAPI Backend
Week 4 Deliverable: 7 REST Endpoints + Error Handling + CORS
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="HimShakti API",
    description="Backend API for HimShakti Food Processing D2C Platform",
    version="1.0.0",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
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

# ── In-memory store (Week 4; DB in Week 5) ────────────────────────────────────
products_db: dict = {
    "p1": {
        "id": "p1",
        "name": "Himalayan Millet Flour",
        "ingredients": "Finger millet (Ragi), Mountain Spring Water",
        "weight": "500g",
        "category": "flour",
        "features": ["Gluten-free", "High calcium", "Stone-ground", "No additives"],
        "description": "Premium Himalayan Millet Flour stone-ground from hand-picked finger millet grown at 1800m altitude. Rich in calcium and iron — a nutritious alternative for rotis, dosas, and baked goods.",
        "tone": "health-focused",
        "price": 120,
        "stock": 85,
        "created_at": "2025-06-01T10:00:00",
    },
    "p2": {
        "id": "p2",
        "name": "Kumaoni Apple Pickle",
        "ingredients": "Fresh Himalayan Apples, Mustard Oil, Rock Salt, Traditional Spices",
        "weight": "250g",
        "category": "pickle",
        "features": ["Traditional recipe", "No preservatives", "Handmade", "60-day shelf life"],
        "description": "Crafted from Himalayan apples using a generations-old Kumaoni recipe. Slow-aged in mustard oil with hand-ground spices — every jar carries the taste of the mountains.",
        "tone": "traditional",
        "price": 180,
        "stock": 42,
        "created_at": "2025-06-03T11:30:00",
    },
    "p3": {
        "id": "p3",
        "name": "Himalayan Herbal Tea",
        "ingredients": "Tulsi, Brahmi, Ginger, Licorice Root, Cardamom",
        "weight": "100g (50 cups)",
        "category": "tea",
        "features": ["Caffeine-free", "Immunity boost", "Wildcrafted herbs", "Hand-blended"],
        "description": "A therapeutic blend of wildcrafted Himalayan herbs — Tulsi for immunity, Brahmi for clarity, Ginger for warmth. Hand-blended in small batches for maximum potency.",
        "tone": "premium",
        "price": 220,
        "stock": 63,
        "created_at": "2025-06-05T09:00:00",
    },
}

# ── Pydantic Models ────────────────────────────────────────────────────────────
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

class GenerateRequest(BaseModel):
    product_name: str = Field(..., min_length=1)
    ingredients: str = Field(..., min_length=1)
    weight: str = Field(..., min_length=1)
    features: List[str] = Field(default=[])
    tone: str = Field(default="health-focused")  # premium | traditional | health-focused

# ── Error handlers ─────────────────────────────────────────────────────────────
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return {"detail": "Resource not found"}, 404

# ── ENDPOINT 1: GET /api/products — list all ──────────────────────────────────
@app.get("/api/products", status_code=200)
def list_products():
    return {
        "products": list(products_db.values()),
        "total": len(products_db),
    }

# ── ENDPOINT 2: GET /api/products/{id} — single product ──────────────────────
@app.get("/api/products/{product_id}", status_code=200)
def get_product(product_id: str):
    product = products_db.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found")
    return product

# ── ENDPOINT 3: POST /api/products — create ───────────────────────────────────
@app.post("/api/products", status_code=201)
def create_product(body: ProductCreate):
    new_id = "p" + str(uuid.uuid4())[:8]
    product = {
        "id": new_id,
        **body.model_dump(),
        "created_at": datetime.now().isoformat(),
    }
    products_db[new_id] = product
    return product

# ── ENDPOINT 4: PUT /api/products/{id} — update ───────────────────────────────
@app.put("/api/products/{product_id}", status_code=200)
def update_product(product_id: str, body: ProductUpdate):
    product = products_db.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found")
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    product.update(updates)
    products_db[product_id] = product
    return product

# ── ENDPOINT 5: DELETE /api/products/{id} — delete ────────────────────────────
@app.delete("/api/products/{product_id}", status_code=204)
def delete_product(product_id: str):
    if product_id not in products_db:
        raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found")
    del products_db[product_id]
    return None

# ── ENDPOINT 6: GET /api/products/search — search by name/category ─────────────
@app.get("/api/products/search/query", status_code=200)
def search_products(
    q: Optional[str] = Query(None, description="Search term"),
    category: Optional[str] = Query(None, description="Filter by category"),
):
    results = list(products_db.values())
    if q:
        q_lower = q.lower()
        results = [
            p for p in results
            if q_lower in p["name"].lower()
            or q_lower in p.get("ingredients", "").lower()
            or any(q_lower in f.lower() for f in p.get("features", []))
        ]
    if category:
        results = [p for p in results if p.get("category", "").lower() == category.lower()]
    if not results:
        raise HTTPException(status_code=404, detail="No products match your search")
    return {"products": results, "total": len(results)}

# ── ENDPOINT 7: POST /api/generate — AI description generation ────────────────
@app.post("/api/generate", status_code=200)
def generate_description(body: GenerateRequest):
    """
    Calls Anthropic Claude to generate an e-commerce product description.
    Falls back to a structured template if the API key is absent (dev mode).
    """
    import anthropic

    tone_prompts = {
        "premium": "Use elevated, aspirational language. Emphasise artisanal craft, rarity, and premium quality. Avoid generic claims.",
        "traditional": "Use warm, storytelling language rooted in cultural heritage and generational recipes. Mention Uttarakhand/Himalayan provenance.",
        "health-focused": "Use clear, benefit-driven language. Lead with nutritional advantages, certifications (if any), and clean-label credentials.",
    }

    tone_instruction = tone_prompts.get(body.tone, tone_prompts["health-focused"])
    features_str = ", ".join(body.features) if body.features else "N/A"

    prompt = f"""You are an expert e-commerce copywriter for HimShakti, a rural food processing unit in Uttarakhand, India, that sells traditional Himalayan food products.

Write a compelling Amazon product description for the following product.

Product Name: {body.product_name}
Key Ingredients: {body.ingredients}
Net Weight: {body.weight}
Key Features: {features_str}
Tone: {body.tone} — {tone_instruction}

Requirements:
- 80–120 words
- Start with a strong hook (no generic openers like "Introducing")
- Include 2–3 specific benefit statements
- End with a subtle call to action
- Do NOT use bullet points — write flowing prose
- Do NOT fabricate certifications or awards

Return ONLY the description text. No preamble, no quotes."""

    try:
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError("No API key")

        client = anthropic.Anthropic(api_key=api_key)
        message = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=300,
            messages=[{"role": "user", "content": prompt}],
        )
        description = message.content[0].text.strip()

    except Exception:
        # Dev fallback — structured template
        tone_label = {
            "premium": "Crafted for the discerning palate",
            "traditional": "A recipe passed down through generations",
            "health-focused": "Nature's goodness, thoughtfully packaged",
        }.get(body.tone, "")

        description = (
            f"{tone_label} — {body.product_name} is made from {body.ingredients}, "
            f"sourced from the Himalayan foothills of Uttarakhand. "
            f"Packed in {body.weight}, it brings you {features_str.lower()} "
            f"in every serving. Support rural artisans and taste the mountains today."
        )

    return {
        "description": description,
        "product_name": body.product_name,
        "tone": body.tone,
    }

# ── Root health check ──────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "HimShakti API",
        "version": "1.0.0",
        "endpoints": [
            "GET  /api/products",
            "GET  /api/products/{id}",
            "POST /api/products",
            "PUT  /api/products/{id}",
            "DELETE /api/products/{id}",
            "GET  /api/products/search/query?q=&category=",
            "POST /api/generate",
        ],
    }