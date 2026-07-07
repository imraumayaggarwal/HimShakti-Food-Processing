# 🏔️ HimShakti D2C Portal

<div align="center">

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-8E75C2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev)

**An intelligent, multi-tenant administrative portal and AI copywriting optimization engine tailored for local Himalayan food processing units.**

[Explore Docs](#-system-architecture) • [Report Bug](https://github.com/your-username/himshakti/issues) • [Request Feature](https://github.com/your-username/himshakti/issues)

</div>

---

## 📌 Overview

**HimShakti** is a specialized production management and marketing acceleration engine designed specifically for local food processing operations in Uttarakhand, India. The application simplifies catalog administration for unique regional inventory assets—such as mountain millets, handmade heritage pickles, and wildcrafted teas—while integrating state-of-the-art Generative AI to automate marketplace optimizations.

### ✦ Core Capabilities

* **🔒 Scoped Multi-Tenancy:** Complete layer isolation across database operations using cryptographic JSON Web Token (JWT) signatures. Users operate in sandboxed instances where product storage maps natively to their identity matrix.
* **🧠 High-Impact Listing Generator:** Direct structural link with the official **Google GenAI SDK (`gemini-2.5-flash`)** to construct high-conversion, keyword-rich Amazon descriptions based on targeted tone frameworks.
* **📐 Viewport-Optimized Copywriting:** The backend prompt rules enforce text outputs strictly between **40–60 words**. This layout architecture guarantees that your descriptions fit cleanly inside dashboard text panels without causing awkward page overflow.
* **🔄 Dynamic Context Pre-Filling:** Replaces static template tools with a live inventory binding menu. Selecting an asset auto-populates metadata coordinates and instantly exposes matching saved copywriting blocks.
* **📊 Live Portfolio Analytics:** Provides real-time calculations monitoring absolute item variance count, unit inventory volume pooling, and dynamic Indian Rupee (₹) net inventory valuation metrics.
* **✏️ Inline Entity Editing:** Interactive data grids that transform classic static product cards into clickable modal entry fields to complete instant category mutations and live stock adjustments.

---

## 🛠️ Tech Stack & Architecture

### Core Infrastructure
* **Backend Interface Layer:** FastAPI ASGI Framework (Python 3.12+)
* **Storage & Relational Mapper:** Supabase Managed Cloud PostgreSQL paired with SQLAlchemy Core
* **Intelligence Pipeline:** Google GenAI SDK Engine (`gemini-2.5-flash`)
* **Security Stack:** URL-Safe Token Encoders, Dynamic SHA-256 HMAC Signatures, HTTPBearer Authentication Middleware

### User Interface Layer
* **Client Architecture:** Next.js 14+ (App Router Deployment, React Client Hydration Hooks)
* **State Protection:** Unified React Hooks `AuthContext` Providers coupled with Route-Level Middleware Interceptors
* **Design Tokens:** Tailwind CSS Engine containing responsive custom dark-mode primitives

---

## 📊 System Architecture

```mermaid
graph LR
    User([User]) --> Frontend[React + Next.js UI]
    Frontend <--> |Secure HTTP Requests + JWT| Backend[FastAPI REST API]
    
    Backend --> Auth[Pure-Python JWT Auth]
    Backend --> DB[(Supabase PostgreSQL)]
    Backend --> Gemini[Google GenAI SDK <br> Gemini 2.5 Flash]

    subgraph Database Models
        DB --> UsersTable[(users Table)]
        DB --> ProductsTable[(products Table)]
    end

    classDef default fill:#1e1e2e,stroke:#313244,stroke-width:1px,color:#cdd6f4;
    classDef highlight fill:#356C4C,stroke:#a6e3a1,stroke-width:1px,color:#fff;
    class Frontend,Backend,Gemini highlight;
```
---
