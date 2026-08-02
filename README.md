# HimShakti Food Processing

Full stack D2C platform for rural food businesses in Uttarakhand.

## Production Deployment

### Frontend on Vercel

1. Import the repository into Vercel.
2. Set the Root Directory to `frontend`.
3. Add the environment variable `NEXT_PUBLIC_API_URL` with your deployed backend URL.
4. Deploy the app. Vercel will use the Next.js build automatically.

### Backend on Render

1. Create a new Web Service on Render from this repository.
2. Set the Root Directory to `backend`.
3. Use the start command `uvicorn main:app --host 0.0.0.0 --port $PORT`.
4. Add the backend environment variables listed below.
5. Deploy the service and copy the Render URL into `NEXT_PUBLIC_API_URL` on Vercel.

## Environment Variables

### Frontend

`frontend/.env.local`

```bash
NEXT_PUBLIC_API_URL=https://your-render-backend.onrender.com
```

### Backend

`backend/.env`

```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname
CLIENT_URL=https://your-vercel-app.vercel.app
JWT_SECRET=replace-with-a-long-random-secret
GEMINI_API_KEY=your-gemini-api-key
```

## Local Development

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

## Known Limitations

- Render free-tier services spin down after about 15 minutes of inactivity, so the first request after idle can take extra time while the backend wakes up.