# Personal Calorie Tracker

A full-stack web application for tracking personal nutrition. Users can create an account, set daily calorie and macro goals, log meals (including micronutrients), review daily and weekly reports with charts, and use AI-powered food image scanning to pre-fill meal forms before saving.

---

## Overview

This project helps users manage nutrition with a clear review-before-save workflow:

- Create an account and log in
- Set daily calorie and macro goals
- Add, edit, delete, and filter meals
- Track calories, protein, carbohydrates, fats, and micronutrients
- View daily/weekly nutrition reports and charts
- Use AI-powered food image scanning to pre-fill nutritional information
- Review and edit AI-generated estimates before saving

---

## Features

- **Authentication and authorization** — register/login with JWT Bearer tokens; passwords hashed with bcryptjs
- **Personal nutrition goals** — daily calories and macro targets (optional weight goal)
- **Meal CRUD** — create, read, update, and delete food entries
- **Meal-type categorization** — breakfast, lunch, dinner, snack
- **Date and meal-type filtering** — filter the meals list by date range and meal type
- **Server-side pagination** — meals list uses page/limit on the API
- **Daily and weekly reports** — calorie totals and trends
- **Macro and micronutrient reports** — protein, carbs, fat, and selected micros
- **Goal vs actual tracking** — compare logged intake against personal goals
- **Dashboard with charts** — summary views powered by Recharts
- **AI food image analysis** — upload a label or plate photo; backend analyzes with Gemini and returns structured nutrition suggestions
- **Meal logging streak** — current and longest consecutive days with meals, shown in the header
- **Responsive UI** — usable on desktop and mobile viewports
- **Input validation and error handling** — Zod on the API; form validation on the client
- **User data isolation** — meals, goals, and reports are scoped to the authenticated user

---

## Tech Stack

### Frontend (`client/`)

- React
- Vite
- Tailwind CSS
- React Router
- Recharts

### Backend (`server/`)

- Node.js
- Express
- Prisma (PostgreSQL via `@prisma/adapter-pg` + `pg`)
- PostgreSQL
- Zod
- JWT (`jsonwebtoken`)
- bcryptjs
- Multer (multipart image uploads)
- Google Gemini (`@google/genai`) — default model **Gemini 2.5 Flash** for food image analysis

---

## Architecture

```
Frontend (React + Vite)
        ↓
   REST API (/api)
        ↓
Express Backend
        ↓
     Prisma
        ↓
   PostgreSQL
```

AI image analysis runs **only on the backend**. The Gemini API key stays in server environment variables and is never sent to or exposed by the frontend.

```
Client uploads image
        ↓
POST /api/ai/analyze-food (JWT + multipart)
        ↓
Gemini analyzes image (server-side)
        ↓
Structured JSON → Zod validation
        ↓
Frontend pre-fills Meal form
        ↓
User reviews / edits
        ↓
POST /api/meals (save only after confirmation)
```

---

## AI Food Scanning

1. The user uploads a **JPEG, PNG, or WebP** image (max **5 MB**).
2. The backend validates file type and size (Multer).
3. **Gemini** analyzes the image and returns structured nutrition fields.
4. The response is validated with **Zod** before it is returned to the client.
5. The frontend pre-fills the **existing meal form**.
6. The user reviews and edits values as needed.
7. The meal is persisted **only** through the normal Meals API after the user confirms.

**Honesty about estimates:** for food / plate photographs, nutrition values are **estimates**, not lab measurements. The app treats a plate meal as approximately **1 serving** rather than inventing an exact gram weight. For **nutrition-label** images, an explicitly printed serving size (for example `50 g`) can be extracted and kept with the label values.

AI analysis does **not** create or save meals by itself.

---

## API Overview

Base URL (local): `http://localhost:5000`

Authenticated endpoints require:

```http
Authorization: Bearer <token>
```

### Authentication

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/auth/me` | Yes |

### Goals

| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/goals` | Yes |
| POST | `/api/goals` | Yes |
| PUT | `/api/goals` | Yes |

### Meals

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/meals` | Yes |
| GET | `/api/meals` | Yes |
| GET | `/api/meals/:id` | Yes |
| PUT | `/api/meals/:id` | Yes |
| DELETE | `/api/meals/:id` | Yes |

`GET /api/meals` supports **server-side pagination and filters**: `page`, `limit`, `mealType`, `startDate`, `endDate` (`YYYY-MM-DD`).

### Reports

| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/reports/daily` | Yes |
| GET | `/api/reports/weekly` | Yes |
| GET | `/api/reports/macros` | Yes |
| GET | `/api/reports/micros` | Yes |
| GET | `/api/reports/streak` | Yes |

Report endpoints accept optional date query parameters (`date` for daily; `startDate` / `endDate` for weekly/macros/micros).

### AI

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/ai/analyze-food` | Yes |

Multipart field name: `image`.

### Health

| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/health` | No |

---

## Setup Instructions

### Prerequisites

- Node.js (LTS recommended)
- PostgreSQL
- A Gemini API key from Google AI Studio (for AI food scanning)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Personal_Calorie_Tracker_Typeface
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

### 4. Create a PostgreSQL database

Create an empty database (example name: `calorie_tracker`).

### 5. Configure the backend environment

Copy the example file and fill in real values:

```bash
cd ../server
cp .env.example .env
```

`server/.env` (placeholders only — never commit real secrets):

```env
DATABASE_URL=your_postgresql_connection_string
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

### 6. Run Prisma generate and migrations

From `server/`:

```bash
npm run prisma:generate
npm run prisma:migrate
```

(`prisma:migrate` runs `prisma migrate dev` and uses the project’s Prisma config.)

### 7. Configure the Gemini API key

Set `GEMINI_API_KEY` in `server/.env`.  
`GEMINI_MODEL` is optional; it defaults to `gemini-2.5-flash` if omitted.

Without a valid key, the rest of the app still works; AI scanning returns a configuration error.

### 8. Start the backend

```bash
cd server
npm start
```

API: `http://localhost:5000`

For auto-reload during development:

```bash
npm run dev
```

### 9. Configure and start the frontend

Copy the client example env:

```bash
cd client
cp .env.example .env
```

`client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite dev server:

```bash
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

**Production frontend build:**

```bash
cd client
npm run build
```

---

## Project Structure

```
Personal_Calorie_Tracker_Typeface/
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── api/                # API clients
│   │   ├── components/         # UI, meals, goals, reports, AI scanner
│   │   ├── context/            # Auth context
│   │   ├── pages/              # Route pages
│   │   ├── routes/             # Protected / public route wrappers
│   │   └── utils/
│   ├── .env.example
│   └── package.json
├── server/                     # Express + Prisma API
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── lib/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── prisma7.config.ts
│   └── package.json
├── .gitignore
└── README.md
```

---

## Testing / Verification

This repository does **not** include an automated test suite (`npm test` on the server is a placeholder).

Recommended manual verification:

1. Register and log in; confirm `/api/auth/me` works with the JWT.
2. Create goals; confirm they appear on the Goals page and Dashboard.
3. Add / edit / delete meals; confirm filters and pagination.
4. Open Reports and Dashboard charts with logged data.
5. Upload a plate image via Scan Food → confirm quantity `1` / unit `serving` and the estimate notice → edit → save via Meals API.
6. Upload a nutrition-label image when available → confirm serving size extraction when printed on the label.
7. Confirm AI scanning fails gracefully if `GEMINI_API_KEY` is missing.
8. Run `npm run build` in `client/` and `npm start` in `server/` successfully.

---

## Future Improvements

Possible follow-ups (not required for the current assignment scope): broader micronutrient coverage, richer report date presets, and stronger automated tests.

---

## Security Notes

- Keep `server/.env` and `client/.env` out of version control (covered by `.gitignore`).
- Never put `GEMINI_API_KEY` or `JWT_SECRET` in frontend code or `VITE_*` variables.
- Use placeholders only in `.env.example` files.
