# Prompts Log: Product Content & Description Generator

This file documents the iterative prompt engineering process used to develop the AI-powered generation feature for listing products on the platform, satisfying the Week 7 internship deliverables.

---

## 🤖 System Prompt / Role Used

Across all variations, the following System Prompt was set in the LLM configuration to establish context and guardrails:

> "You are an AI data assistant built for a D2C food processing platform. Your task is to process incoming user inputs and structure them accurately according to our internal product database specifications. Ensure that key required fields are thoroughly expanded while optional details match a clean, standard commercial tone."

---

## 🧪 Prompt Variations Tested

### 📝 Variation 1: Basic Unstructured Text
*   **Prompt String:** 
    `"Take these fields and fill out the details: Product Name: {product_name}, Ingredients: {ingredients}, Weight: {weight}, Category: {category}."`
*   **Example Input:** 
    *   **Product Name:** Himalayan Jakhiya Infused Flour
    *   **Ingredients:** Whole wheat flour, Jakhiya seeds
    *   **Weight / Volume:** 1kg
    *   **Category:** Flour
*   **Example Output:** 
    `"Product Name: Himalayan Jakhiya Infused Flour. Ingredients: Whole wheat flour, Jakhiya seeds. Weight / Volume: 1kg. Category: Flour. Key Features: healthy, organic. Price: 150. Stock: 100. Description: This is a healthy flour made with local ingredients."`

### 📝 Variation 2: Structured Formatting with Optional Expansions
*   **Prompt String:** 
    `"Format the following product details into clean markdown key-value pairs. Based on the provided Product Name ({product_name}) and Ingredients ({ingredients}), automatically generate 3 compelling 'Key Features' and a professional 2-sentence 'Description'. Use the placeholder values for Price and Stock if not provided."`
*   **Example Input:** 
    *   **Product Name:** Himalayan Jakhiya Infused Flour
    *   **Ingredients:** Whole wheat flour, Jakhiya seeds
    *   **Weight / Volume:** 1kg
    *   **Category:** Flour
*   **Example Output:** 
    ```markdown
    * **Product Name *:** Himalayan Jakhiya Infused Flour
    * **Ingredients *:** Whole wheat flour, Jakhiya seeds
    * **Weight / Volume *:** 1kg
    * **Category:** Flour
    * **Key Features (comma-separated):** Organic, High-Fiber, Traditional Stone-Ground
    * **Price (₹):** 199
    * **Stock (units):** 50
    * **Description (optional):** A nutrient-packed regional staple blending premium whole wheat with crunchy, native Jakhiya seeds. Perfect for upgrading your daily rotis with authentic mountain flavor and health benefits.
    ```

### 📝 Variation 3: Strict JSON Generation for Schema Mapping (Final Selection)
*   **Prompt String:** 
    `"Act as a D2C inventory ingest manager. Analyze the provided product details: Name: {product_name}, Ingredients: {ingredients}, Weight: {weight}, Category: {category}. You must return a strict JSON object mapping exactly to our backend schema keys. Automatically synthesize high-converting tags for 'key_features' and write an engaging marketing blurb for 'description'. Do not return any conversational text outside the JSON block."`
*   **Example Input:** 
    *   **Product Name:** Himalayan Jakhiya Infused Flour
    *   **Ingredients:** Whole wheat flour, Jakhiya seeds
    *   **Weight / Volume:** 1kg
    *   **Category:** Flour
*   **Example Output:** 
    ```json
    {
      "product_name": "Himalayan Jakhiya Infused Flour",
      "ingredients": "Organic Whole wheat flour, Wild-Harvested Jakhiya seeds",
      "weight_volume": "1kg",
      "category": "Flour",
      "key_features": "High-Fiber, Nutty Crunch, 100% Organic, Preservative-Free",
      "price_inr": 149,
      "stock_units": 200,
      "description": "Sourced from high-altitude organic farms, this stone-ground whole wheat flour is uniquely pre-blended with crunchy Jakhiya seeds. Bring the authentic culinary heritage and rich antioxidant benefits of Uttarakhand straight to your dining table."
    }
    ```

---

## 🏆 Final Selection & Evaluation

**Which one worked best and why:**
Variation 3 was selected as the final prompt implementation because it enforces a rigid JSON output structure that allows our FastAPI backend to reliably parse the text generation into explicit object keys. Unlike Variation 1, which lacked detail, or Variation 2, which yielded highly variable markdown formatting, Variation 3 consistently produces reliable fields that directly map to our database models. This approach ensures that even if a vendor inputs minimal product information, the AI seamlessly auto-generates high-converting marketing content, key feature tags, and standard inventory defaults without breaking the web application.