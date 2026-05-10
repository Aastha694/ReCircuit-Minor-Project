# ReCircuit

**AI-Enabled E-Waste Management & Smart Buyer Matching**

ReCircuit is an MVP web platform that allows users to photograph electronic items, auto-classifies them using an AI model, and instantly matches them with verified buyers and recyclers.

## Project Structure

This is a microservices-inspired monorepo:
- `/frontend` - React.js (Vite) application
- `/backend` - Node.js (Express) API and MongoDB integration
- `/ai-service` - Python (Flask) microservice for TensorFlow/Keras AI predictions

## Prerequisites

- **Node.js**: v18+ (v22 recommended)
- **Python**: 3.9+ (v3.13 tested)
- **MongoDB**: A local or remote MongoDB instance (Update `MONGODB_URI` in `.env`)
- **Clerk Account**: A free Clerk account for Auth integration

---

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Configure Environment variables (`backend/.env`):
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/recircuit
CLERK_SECRET_KEY=your_clerk_secret_key_here
AI_SERVICE_URL=http://localhost:5000
```

Seed Database (Loads 12 demo buyers):
```bash
npm run seed
```

Start Development Server:
```bash
npm run dev
```

### 2. AI Service Setup

```bash
cd ai-service
pip install -r requirements.txt
```

Start the Flask server:
```bash
python app.py
```
*(Note: If no trained model is present in `ai-service/model/`, it defaults to a deterministic demo mode to allow full end-to-end testing).*

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Configure Environment variables (`frontend/.env`):
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
VITE_API_URL=http://localhost:3000/api
```

Start the Vite development server:
```bash
npm run dev
```

---

## API Documentation

### Backend (Node.js/Express)

Base URL: `http://localhost:3000/api`
All routes (except `/health`) require a Clerk JWT Bearer Token.

- **`POST /upload`**: Uploads an image, proxies it to the AI Service, saves a submission to the database, and returns matched buyers.
  - **Body**: `multipart/form-data` with an `image` field.
- **`GET /buyers?category=X`**: Returns a list of buyers for the specified category.
- **`PATCH /submissions/:id/category`**: Overrides the AI-predicted category with a user-selected one, and returns new matched buyers.

### AI Service (Flask)

Base URL: `http://localhost:5000`

- **`POST /classify`**: Analyzes the image and returns category predictions.
  - **Body (JSON)**: `{ "image_path": "/absolute/path/to/image.jpg" }`
  - **Response**: `{ "category": "laptop_tablet", "confidence": 0.95 }`

---

## Testing

**Frontend** (Vitest/JSDOM):
```bash
cd frontend
npm test
```

**Backend** (Jest/Supertest):
```bash
cd backend
npm test
```

## Deployment Guidelines

- **Frontend**: Deploy to Vercel or Netlify. Set `VITE_CLERK_PUBLISHABLE_KEY` and `VITE_API_URL` (pointing to your live backend domain).
- **Backend**: Deploy to Render, Railway, or Heroku. Make sure the MongoDB URI points to your MongoDB Atlas cluster. Set `CLERK_SECRET_KEY` and `AI_SERVICE_URL`.
- **AI Service**: Deploy via Docker to Google Cloud Run, AWS App Runner, or Render.

*End of Documentation*
