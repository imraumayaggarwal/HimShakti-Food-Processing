from fastapi import APIRouter
import os
from google import genai
from google.genai import types

from models import GenerateRequest

router = APIRouter(prefix="/api", tags=["generate"])

TONE_PROMPTS = {
    "premium": "Use elevated, aspirational language. Emphasise artisanal craft, rarity, and premium quality. Avoid generic claims.",
    "traditional": "Use warm, storytelling language rooted in cultural heritage and generational recipes. Mention Uttarakhand/Himalayan provenance.",
    "health-focused": "Use clear, benefit-driven language. Lead with nutritional advantages and clean-label credentials.",
}
try:
    client = genai.Client()
except Exception:
    client = None


@router.post("/generate", status_code=200)
def generate_description(body: GenerateRequest):
    """
    Calls Google Gemini to generate an e-commerce product description.
    Falls back to a structured template if GEMINI_API_KEY is absent (dev mode).
    """
    tone_instruction = TONE_PROMPTS.get(body.tone, TONE_PROMPTS["health-focused"])
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
- Write flowing prose — no bullet points
- Do NOT fabricate certifications or awards

Return ONLY the description text. No preamble, no quotes."""

    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or not client:
            raise ValueError("No Gemini API key configured")

        # Call Gemini 2.5 Flash
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        description = response.text.strip()

    except Exception:
        # Dev fallback
        tone_label = {
            "premium": "Crafted for the discerning palate",
            "traditional": "A recipe passed down through generations",
            "health-focused": "Nature's goodness, thoughtfully packaged",
        }.get(body.tone, "")

        description = (
            f"{tone_label} — {body.product_name} is made from {body.ingredients}, "
            f"sourced from the Himalayan foothills of Uttarakhand. "
            f"Packed in {body.weight}, it delivers {features_str.lower()} "
            f"in every serving. Support rural artisans and taste the mountains today."
        )

    return {
        "description": description,
        "product_name": body.product_name,
        "tone": body.tone,
    }