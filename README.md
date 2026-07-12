# HimShakti-Food-Processing

The main objective of this project is to develop a digital solution for HimShakti Food 
Processing Unit to improve its online presence and customer reach . Currently , the 
organization primarily relies on distribution for product sales . The main of the project is that 
to create a Direct-to-Consumer landing page that showcase products and product and 
enables customer to place inquiries through WhatsApp . Additionally , an AI-powered 
commerce listings for online marketplaces. 

# HimShakti Food Processing — Full Stack App

> D2C platform for rural food businesses in Uttarakhand.  
> AI-generated product descriptions + product management dashboard.

---

## Project Structure

```
HimShakti-Food-Processing/
├── backend/
│   ├── main.py          # FastAPI app — 7 REST endpoints
│   ├── requirements.txt
│   ├── .env.example     # Copy to .env and add your API key
│   └── .gitignore
├── frontend/
│   ├── app/
│   │   ├── dashboard/page.tsx   # Product management + live API
│   │   ├── generate/page.tsx    # AI description generator
│   │   ├── login/page.tsx
│   │   ├── product/page.tsx
│   │   └── settings/page.tsx
│   └── components/
└── README.md
```

---

## How to Run Backend Locally

### Prerequisites
- Python 3.10+
- pip

### Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate         # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up environment variables
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# 5. Start the server
uvicorn main:app --reload --port 8000
```

Server runs at **http://localhost:8000**  
Interactive API docs at **http://localhost:8000/docs**

---

## API Endpoints

| Method | Endpoint | Description | Status Code |
|--------|----------|-------------|-------------|
| GET | `/api/products` | List all products | 200 |
| GET | `/api/products/{id}` | Get single product | 200 / 404 |
| POST | `/api/products` | Create product | 201 / 422 |
| PUT | `/api/products/{id}` | Update product | 200 / 404 |
| DELETE | `/api/products/{id}` | Delete product | 204 / 404 |
| GET | `/api/products/search/query?q=&category=` | Search & filter | 200 / 404 |
| POST | `/api/generate` | AI description generation | 200 |

---

## How to Run Frontend Locally

```bash
cd frontend
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

Frontend runs at **http://localhost:3000**

---

## Environment Variables

### Backend (`backend/.env`)
```
ANTHROPIC_API_KEY=your_key_here
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Week 4 Deliverables

- [x] FastAPI backend with 7 REST endpoints
- [x] Correct HTTP status codes (200, 201, 204, 404, 422, 500)
- [x] Error handling on all endpoints
- [x] `.env.example` committed; `.env` gitignored
- [x] Postman collection: `W4_APICollection_HimShakti.json`
- [x] Frontend connected to backend (dashboard + generate page)
- [x] Loading states (Loader component) and error states (Toast component)
- [x] CORS configured for `localhost:3000`