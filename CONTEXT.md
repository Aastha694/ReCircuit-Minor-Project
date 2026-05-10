# ReCircuit — Project Context for IDE Agents

## What this project is

ReCircuit is an AI-enabled e-waste management MVP. A user photographs electronic waste,
the app classifies it using a TensorFlow model, and instantly shows matched buyers/recyclers
who accept that category. Built as a university minor project.

---

## Monorepo structure

```
recircuit/
├── frontend/          # React 19 + Vite 8 + TailwindCSS 3
├── backend/           # Node.js + Express 5 + MongoDB (Mongoose)
└── ai-service/        # Python 3.9+ Flask microservice
```

---

## Tech stack at a glance

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React 19, Vite 8, TailwindCSS 3 | Glassmorphism UI, Framer Motion |
| Auth | Clerk (`@clerk/react`) | JWT passed as Bearer token to backend |
| Routing | React Router v7 | `/`, `/dashboard`, `/results` |
| HTTP client | Axios | `frontend/src/hooks/useApi.js` |
| Backend | Node.js + Express 5 | ES Modules (`"type": "module"`) |
| Auth middleware | `@clerk/express` | `clerkMiddleware()` + `requireAuth()` |
| File uploads | Multer v2 | Saves to `backend/uploads/`, JPEG/PNG only, 10 MB max |
| Database | MongoDB via Mongoose 9 | Two collections: `buyers`, `submissions` |
| AI service | Flask + TensorFlow 2.20+ | MobileNetV2 transfer learning, falls back to deterministic demo if no model file |
| Testing (FE) | Vitest + Testing Library | `frontend/vitest.config.js` |
| Testing (BE) | Jest + Supertest | `backend/jest.config.js` |

---

## Environment variables

### `backend/.env`
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/recircuit
CLERK_SECRET_KEY=sk_test_...
AI_SERVICE_URL=http://localhost:5000
```

### `frontend/.env`
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:3000/api
```

Both `.env` files are gitignored. Get keys from the Clerk dashboard
(https://dashboard.clerk.com) under the shared team project.

---

## First-time setup (run in order)

```bash
# 1. Backend
cd backend && npm install
# Create backend/.env with the vars above
mkdir -p uploads          # must exist or multer throws on first upload
npm run seed              # loads 12 demo buyers into MongoDB
npm run dev               # starts on :3000, uses --watch (no nodemon needed)

# 2. AI service
cd ai-service && pip install -r requirements.txt
python app.py             # starts on :5000
# No trained model needed — demo mode auto-activates

# 3. Frontend
cd frontend && npm install
# Create frontend/.env with the vars above
npm run dev               # starts on :5173
```

---

## Data models

### Buyer (`backend/models/Buyer.js`)
```js
{
  name: String,
  accepted_categories: [String],   // enum: see CATEGORIES below
  contact_email: String,
  contact_phone: String,
  location_city: String
}
```

### Submission (`backend/models/Submission.js`)
```js
{
  user_id: String,          // Clerk user ID (not ObjectId)
  image_path: String,       // e.g. "/uploads/ewaste-1234567890.jpg"
  ai_category: String,      // what the model predicted
  ai_confidence: Number,    // 0–1
  user_category: String,    // user override (defaults to ai_category)
  created_at: Date
}
```

### Valid categories (used everywhere)
```
mobile_device | laptop_tablet | circuit_board | battery | other
```
Confidence below 0.4 is automatically coerced to `other` in `uploadController.js`.

---

## API routes

Base URL: `http://localhost:3000/api`  
All routes except `/health` require `Authorization: Bearer <clerk_jwt>`.

| Method | Path | What it does |
|---|---|---|
| GET | `/health` | Liveness check, no auth |
| POST | `/upload` | Multipart image → AI classify → save submission → return matched buyers |
| GET | `/buyers?category=X` | Returns buyers accepting category X |
| PATCH | `/submissions/:id/category` | Override AI category, re-match buyers |

### POST /upload — request
```
Content-Type: multipart/form-data
Body field: image  (File, JPEG or PNG)
```

### POST /upload — response shape
```json
{
  "submission": {
    "id": "...",
    "image_path": "/uploads/ewaste-xxx.jpg",
    "ai_category": "mobile_device",
    "ai_confidence": 0.87,
    "user_category": "mobile_device",
    "created_at": "2026-05-10T..."
  },
  "buyers": [
    {
      "id": "...",
      "name": "GreenTech Recyclers",
      "accepted_categories": ["mobile_device"],
      "contact_email": "info@greentechrecyclers.com",
      "contact_phone": "+91-9876543210",
      "location_city": "Delhi"
    }
  ]
}
```

### AI service — POST /classify
```
POST http://localhost:5000/classify
Content-Type: application/json
{ "image_path": "/absolute/path/to/file.jpg" }

Response: { "category": "laptop_tablet", "confidence": 0.95 }
```

The backend sends the **absolute filesystem path** of the uploaded file.
Both services must run on the same machine (shared filesystem dependency).

---

## Frontend page map

| Route | File | What it renders |
|---|---|---|
| `/` | `src/pages/Landing.jsx` | Public marketing page, two sections (hero + capabilities) |
| `/dashboard` | `src/pages/Dashboard.jsx` | Drag-drop upload, preview, submit |
| `/results` | `src/pages/Results.jsx` | AI result, confidence, category override, buyer cards |

Auth gates: `/dashboard` and `/results` redirect to `/` when signed out (Clerk `<Show>`).
If a user lands on `/results` with no React Router state, they are redirected to `/dashboard`.

### Custom hook — `src/hooks/useApi.js`
Wraps all API calls. Gets the Clerk JWT automatically via `useAuth().getToken()`.
```js
const { uploadImage, updateCategory } = useApi();
await uploadImage(file);                          // POST /upload
await updateCategory(submissionId, category);     // PATCH /submissions/:id/category
```

### Reusable components
- `Navbar.jsx` — fixed top bar, shown on all pages except `/`
- `BlurText.jsx` — animated word-by-word text reveal (Framer Motion)
- `FadingVideo.jsx` — auto-play looping video with fade in/out transitions

---

## AI service detail

**Model loading order** (`ai-service/app.py`):
1. Looks for `ai-service/model/model.h5` (Keras)
2. Looks for `ai-service/model/model.tflite` (TFLite)
3. Looks for `ai-service/model/saved_model/` (SavedModel)
4. Falls back to deterministic demo: `CATEGORIES[hash(image_path) % 5]`

**To train your own model:**
```bash
cd ai-service
python prepare_data.py    # downloads dataset from Kaggle, organises into dataset/
python train_model.py     # trains MobileNetV2, saves best to model/model.h5
```
Requires Kaggle credentials configured (`kagglehub`).

**Image preprocessing**: resizes to 224×224, normalises to [-1, 1] (MobileNetV2 convention).

---

## Known issues / gotchas

1. **`backend/uploads/` must exist** — Multer will throw if the folder is missing.
   The repo does not create it automatically. Run `mkdir -p backend/uploads` after cloning.

2. **Shared filesystem dependency** — the AI service receives an absolute path to the
   uploaded file. Both the backend and AI service must run on the same machine.
   Dockerising them into separate containers will break classification.

3. **Frontend tests are stale** — `Landing.test.jsx` checks for text that no longer
   exists in the component ("Don't Junk It.", "Snap a Photo"). Tests will fail.
   Also mocks `@clerk/clerk-react` but the app uses `@clerk/react`.

4. **`ClerkProvider` missing publishableKey prop** — `main.jsx` passes no explicit prop;
   it relies on Vite auto-injecting `VITE_CLERK_PUBLISHABLE_KEY`. Works in dev but
   can silently fail if the env var is missing. Better to be explicit:
   `<ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>`

5. **No CORS config for production** — `backend/server.js` hardcodes
   `origin: 'http://localhost:5173'`. Update this before deploying.

---

## Running tests

```bash
# Frontend (Vitest)
cd frontend && npm test

# Backend (Jest)
cd backend && npm test
```

---

## Seeded buyers (for testing)

The `npm run seed` command clears and re-inserts 12 buyers covering all categories.
Notable ones for quick testing:

| Name | Categories | City |
|---|---|---|
| GreenTech Recyclers | mobile_device | Delhi |
| LaptopRevive India | laptop_tablet | Bangalore |
| CircuitHarvest Pvt Ltd | circuit_board | Chennai |
| PowerCell Recovery | battery | Ahmedabad |
| AllWaste Electronics | all categories | Delhi |
| UrbanMine Recyclers | mobile_device, circuit_board | Chandigarh |

---

## Deployment notes (not yet done)

- **Frontend** → Vercel/Netlify. Set `VITE_CLERK_PUBLISHABLE_KEY` and `VITE_API_URL`.
- **Backend** → Render/Railway. Set all backend env vars, point `MONGODB_URI` to Atlas.
- **AI service** → needs same machine as backend (filesystem coupling). If containerising,
  mount a shared volume between the two containers for the uploads directory.
