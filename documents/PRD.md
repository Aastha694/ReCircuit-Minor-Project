♻

**ReCircuit**

_AI-Enabled E-Waste Management & Smart Buyer Matching_

**PRODUCT REQUIREMENTS DOCUMENT - MVP**

Amity University Punjab • End Term Evaluation • 2025

# **1\. Product Overview**

ReCircuit is a web-based platform that lets users photograph an electronic item, get it auto-classified by an AI model, and be instantly matched with verified buyers or recyclers. The MVP targets the core loop only - everything else is post-launch scope.

# **2\. Problem Statement**

People with unwanted electronics face three friction points:

- No easy way to identify what category their device falls into.
- No trusted directory of buyers / recyclers sorted by item type.
- No single place to go from "I have junk" to "someone will take it."

The result: devices sit unused, are thrown in general waste, or end up in unregulated second-hand markets.

# **3\. MVP Goal & Success Criteria**

## **3.1 Goal**

Ship a working end-to-end demo in time for end-term evaluation: user uploads image → AI classifies → system shows matched buyer list.

## **3.2 Success Criteria**

| **Metric**                    | **Target for Evaluation**                |
| ----------------------------- | ---------------------------------------- |
| Image classification accuracy | ≥ 70 % on the 5 supported categories     |
| End-to-end flow completion    | Upload → result in < 10 seconds          |
| Buyer match relevance         | At least 2 relevant results per query    |
| Zero crash demo               | Full flow runs without error on demo day |

# **4\. MVP Scope**

## **4.1 In Scope**

- User registration & login (email + password, JWT auth)
- Image upload interface (single image, JPEG/PNG)
- AI classification into 5 categories: Mobile Device, Laptop/Tablet, Circuit Board, Battery, Other
- Hardcoded / seeded buyer database (10-15 demo buyers in MongoDB)
- Rule-based buyer matching: filter buyers by accepted category
- Results page showing matched buyers with name, category, and contact info
- Basic responsive UI (React.js)

## **4.2 Explicitly Out of Scope for MVP**

- Real-time price estimation
- Location-based proximity filtering
- User ratings / reviews
- Mobile application
- Payment or transaction processing
- Buyer self-registration portal
- Admin dashboard

# **5\. User Stories**

| **ID** | **As a…**      | **I want to…**                 | **So that…**                           | **Priority**     |
| ------ | -------------- | ------------------------------ | -------------------------------------- | ---------------- |
| US-01  | New user       | Create an account              | I can track my submissions             | Must Have        |
| US-02  | Logged-in user | Upload a photo of my e-waste   | The system can identify it             | Must Have        |
| US-03  | Logged-in user | See the AI-predicted category  | I know what my device is classified as | Must Have        |
| US-04  | Logged-in user | See a list of matched buyers   | I can contact someone to take my item  | Must Have        |
| US-05  | Logged-in user | View buyer contact details     | I can reach out directly               | Must Have        |
| US-06  | User           | Correct the predicted category | I can override wrong classifications   | Should Have      |
| US-07  | User           | See past upload history        | I can review previous submissions      | Won't Have (MVP) |

# **6\. Feature Specifications**

## **F-01 Authentication**

Simple JWT-based auth. No OAuth for MVP.

- POST /api/auth/register - email, password, name
- POST /api/auth/login - returns JWT token (24 h expiry)
- Protected routes require Bearer token in header

## **F-02 Image Upload & Classification**

The single most critical feature. Must work reliably.

- Frontend: drag-and-drop or file picker, preview before submit
- Backend: receives multipart form data, saves to /uploads/
- AI service (Python / Flask microservice): loads trained CNN model, accepts image path, returns { category, confidence }
- Supported categories: mobile_device | laptop_tablet | circuit_board | battery | other
- If confidence < 40%, return category = "other" with a low-confidence flag

## **F-03 Buyer Matching**

Rule-based for MVP - no ML needed here.

- MongoDB buyers collection seeded with 10-15 records
- Each buyer document: { name, accepted_categories: \[\], contact, location_city }
- Match logic: return buyers where accepted_categories includes the predicted category
- Sort by number of accepted categories (ascending) = more specialised buyers first

## **F-04 Results Display**

- Show predicted category with confidence badge
- Show matched buyers as cards: name, accepted categories chips, contact button
- "Correct Category" dropdown allows user to re-trigger match with different category

# **7\. Technical Stack**

| **Layer**      | **Technology**                        | **Rationale**                                     |
| -------------- | ------------------------------------- | ------------------------------------------------- |
| Frontend       | React.js (Vite)                       | Already defined in project report; fast dev setup |
| Backend API    | Node.js + Express.js                  | Already defined; handles routing and DB calls     |
| AI Service     | Python + Flask + TensorFlow/Keras     | Separate microservice; easier to swap model later |
| Database       | MongoDB (Atlas free tier)             | Already defined; flexible schema for buyers       |
| Auth           | JWT (jsonwebtoken package)            | Stateless; no session store needed for MVP        |
| File Storage   | Local /uploads/ folder                | No S3 needed for eval demo                        |
| Model Training | Google Teachable Machine or Keras CNN | Teachable Machine = fastest path to working model |

# **8\. System Architecture (MVP)**

Three-service setup running locally:

- Frontend (React - port 5173) → calls Backend REST API
- Backend (Express - port 3000) → reads/writes MongoDB, calls AI Service
- AI Service (Flask - port 5000) → loads model on startup, exposes POST /classify

On image upload: React → POST /api/upload (Express) → saves file → calls <http://localhost:5000/classify> → returns JSON to React.

# **9\. Data Models**

## **9.1 User**

| **Field**     | **Type** | **Notes**        |
| ------------- | -------- | ---------------- |
| \_id          | ObjectId | Auto             |
| name          | String   | Required         |
| email         | String   | Unique, required |
| password_hash | String   | bcrypt hashed    |
| created_at    | Date     | Auto             |

## **9.2 Buyer**

| **Field**           | **Type**            | **Notes**                  |
| ------------------- | ------------------- | -------------------------- |
| \_id                | ObjectId            | Auto                       |
| name                | String              | Company or individual name |
| accepted_categories | Array&lt;String&gt; | Subset of 5 MVP categories |
| contact_email       | String              | Required                   |
| contact_phone       | String              | Optional                   |
| location_city       | String              | For future geo-filtering   |

## **9.3 Submission**

| **Field**     | **Type** | **Notes**                                 |
| ------------- | -------- | ----------------------------------------- |
| \_id          | ObjectId | Auto                                      |
| user_id       | ObjectId | Ref: User                                 |
| image_path    | String   | Local path                                |
| ai_category   | String   | Predicted category                        |
| ai_confidence | Number   | 0-1                                       |
| user_category | String   | Override if corrected; else = ai_category |
| created_at    | Date     | Auto                                      |

# **10\. API Endpoints**

| **Method** | **Endpoint**                  | **Auth?** | **Description**                           |
| ---------- | ----------------------------- | --------- | ----------------------------------------- |
| POST       | /api/auth/register            | No        | Create account                            |
| POST       | /api/auth/login               | No        | Login, returns JWT                        |
| POST       | /api/upload                   | Yes       | Upload image, get classification + buyers |
| GET        | /api/buyers?category=X        | Yes       | Fetch buyers for a category               |
| PATCH      | /api/submissions/:id/category | Yes       | Override predicted category               |

# **11\. UI Screens (MVP)**

| **Screen**         | **Route**    | **Key Elements**                                       |
| ------------------ | ------------ | ------------------------------------------------------ |
| Landing / Login    | /            | Login form, Register link, brief tagline               |
| Register           | /register    | Name, email, password fields                           |
| Dashboard / Upload | /dashboard   | Drag-drop upload zone, submit button                   |
| Results            | /results/:id | Category badge, confidence %, buyer cards with contact |
| 404                | \*           | Simple error page                                      |

# **12\. Rapid Development Sprint Plan**

Target: 2-3 weeks to a demo-ready build.

## **Sprint 1 - Foundation (Days 1-4)**

- Set up monorepo: /frontend, /backend, /ai-service
- Backend: Express boilerplate, MongoDB connection, User model, auth routes
- Frontend: Vite + React scaffold, React Router, login + register pages
- Seed MongoDB with 12 demo buyers across all 5 categories

## **Sprint 2 - Core Feature (Days 5-9)**

- AI Service: train CNN on Teachable Machine with ~100 images per category; export TFLite or SavedModel
- Flask /classify endpoint: load model, accept image, return JSON
- Backend: /api/upload - save file, call Flask, save Submission, return buyers
- Frontend: Dashboard upload form, results page with buyer cards

## **Sprint 3 - Polish & Demo Prep (Days 10-14)**

- Add category override (dropdown on results page)
- Responsive CSS pass - test on mobile screen size
- Error states: invalid file type, no buyers found, low confidence warning
- End-to-end happy path test with 5 sample images (one per category)
- Write 1-page demo script for evaluators

# **13\. Risks & Mitigations**

| **Risk**                           | **Likelihood** | **Impact** | **Mitigation**                                                                    |
| ---------------------------------- | -------------- | ---------- | --------------------------------------------------------------------------------- |
| Model accuracy too low             | Medium         | High       | Use Google Teachable Machine; augment dataset; lower confidence threshold to 40 % |
| Flask ↔ Express integration issues | Low            | Medium     | Test microservice independently first; use Axios with timeout                     |
| Demo environment problems          | Medium         | High       | Run entirely locally; pre-record a backup screen capture                          |
| Not enough buyer data              | Low            | Medium     | Manually seed 15 records covering all 5 categories                                |
| Time overrun on AI training        | Medium         | High       | Start model training in Sprint 1 in parallel with backend work                    |

# **14\. Post-MVP Roadmap (Not for Evaluation)**

These features are documented here to avoid scope creep during build - they belong to a future release:

- Location-based geo-filtering (haversine distance, Google Maps API)
- Real-time price estimation model
- Buyer self-registration and profile management
- User rating and review system
- React Native mobile app
- Government / certified recycler API integration
- Admin analytics dashboard

_- End of Document -_

ReCircuit MVP PRD • Aastha Sawant & Vivek Khandelwal • Amity University Punjab