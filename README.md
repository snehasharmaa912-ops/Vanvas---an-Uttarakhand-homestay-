<div align="center">

# 🏔️ VanaVas
### Uttarakhand Homestay & Eco-stay Platform

*Connecting rural homestay owners across Uttarakhand with eco-conscious travelers — in real time.*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-vanavas.vercel.app-2d7a4f?style=for-the-badge&logo=vercel&logoColor=white)](https://vanvas-an-uttarakhand-homestay.vercel.app)
[![Demo Video](https://img.shields.io/badge/Demo%20Video-YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](PASTE_YOUTUBE_UNLISTED_LINK_HERE)
[![License](https://img.shields.io/badge/License-MIT-a96f2b?style=for-the-badge)](#license)

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-010101?style=flat-square&logo=socket.io&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-0055FF?style=flat-square&logo=framer&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

</div>

---

## 📋 Table of Contents

- [What it does](#-what-it-does)
- [Live Demo](#-live-demo)
- [Demo Video](#-demo-video)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Setup Instructions](#-setup-instructions)
- [API Documentation](#-api-documentation)
- [Architecture / Folder Structure](#️-architecture--folder-structure)
- [Known Limitations](#-known-limitations)
- [Credits & Acknowledgements](#-credits--acknowledgements)

---

## 🌿 What it does

Rural homestay hosts in Uttarakhand have no digital presence — they rely on word-of-mouth or pay 30–40% commissions to agents. **VanaVas** gives them a simple platform to list, manage, and earn directly from travelers.

Travelers get a curated, verified, and genuinely local experience — searchable by district, budget, stay type, and eco-rating — and can send a booking request that reaches the host **instantly**, with live status updates as the host responds.

---

## 🚀 Live Demo

**Frontend:** [https://vanvas-an-uttarakhand-homestay.vercel.app](https://vanvas-an-uttarakhand-homestay.vercel.app)
**Backend API:** `https://vanvas-an-uttarakhand-homestay.onrender.com`

> ⚠️ The backend is hosted on Render's free tier and spins down after ~15 minutes of inactivity. The first request after being idle can take 30–60 seconds to wake up — this is expected, not a bug (see [Known Limitations](#-known-limitations)).

---

## 🎬 Demo Video

📺 **Watch the 5-minute walkthrough:** 

The video covers: app introduction → register/login flow → core booking flow → AI Trip Planner in action → a brief code tour.

---

## 📸 Screenshots

<div align="center">

| Home | Explore | Host Dashboard |
|:---:|:---:|:---:|
| ![Home](docs/screenshots/home.jpg) | ![Explore](docs/screenshots/explore.jpg) | ![Host Dashboard](docs/screenshots/host-dashboard.jpg) |

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

**🔐 Secure Authentication**
bcrypt-hashed passwords, JWT sessions, Google OAuth one-click sign-in, and a 6-digit email OTP flow for admin access

**🛡️ Protected Routes**
API (`requireAuth` middleware) and frontend (`ProtectedRoute` component) routes both reject/redirect unauthenticated access

**⚡ Real-time Booking**
Requests appear on the host's dashboard live via WebSocket — no refresh, no polling

**🤖 AI Trip Planner**
Traveler describes their ideal stay and AI recommends the top 3 homestays with a matching itinerary, streamed live and refinable ("cheaper", "more eco-friendly", etc.)

</td>
<td width="50%">

**🧑‍🌾 Role-based Experience**
Traveler, host, and admin each get a tailored view and permission set

**🎬 Polished Micro-interactions**
Page transitions, scroll-reveal cards, animated wishlist hearts, spring nav indicators — built with Framer Motion

**🚦 Rate Limiting & Validation**
Zod schema validation on every auth endpoint, 5-attempts/15-min throttling on auth, separate limiter on AI endpoints

**🗺️ AI Listing Assistant**
Hosts fill a simple Hindi form and AI generates a clean, English property description

</td>
</tr>
</table>

---

## ⚡ Tech Stack

| Layer          | Technology                                          |
|----------------|------------------------------------------------------|
| Frontend       | React.js + Tailwind CSS + Framer Motion              |
| Routing        | React Router v6                                      |
| Backend        | Node.js + Express.js                                 |
| Real-time      | Socket.io                                             |
| Database       | MongoDB (Atlas) + Mongoose                            |
| Auth           | JWT (`jsonwebtoken`) + bcrypt + Passport.js (Google OAuth) |
| Validation     | Zod                                                   |
| Rate limiting  | express-rate-limit                                    |
| Email (OTP)    | Resend API                                            |
| AI             | Google Gemini API                                     |
| Deploy         | Vercel (frontend) + Render (backend)                  |

---

## 🚀 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/snehasharmaa912-ops/Vanvas---an-Uttarakhand-homestay-.git
cd Vanvas---an-Uttarakhand-homestay-
```

### 2. Frontend

```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

Create a `.env` in the repo root (see `.env.example`):
```env
VITE_API_URL=http://localhost:5000
```

### 3. Backend

```bash
cd backend
npm install
npm run dev
```
The API + Socket.io server runs at [http://localhost:5000](http://localhost:5000)

Create a `backend/.env` (see `backend/.env.example` for the full list):

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbName
JWT_SECRET=replace-with-a-long-random-string
ADMIN_EMAIL=your-admin-email@example.com
RESEND_API_KEY=replace-with-your-resend-api-key
OTP_FROM_EMAIL=VanaVas <onboarding@resend.dev>
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=replace-with-your-google-client-id
GOOGLE_CLIENT_SECRET=replace-with-your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
GEMINI_API_KEY=replace-with-your-gemini-api-key
```

### 4. Seed sample data (optional)

```bash
cd backend
node seed.js
```

---

## 📡 API Documentation

<details open>
<summary><b>Stays</b></summary>

| Method | Endpoint                | Auth | Description                    |
|--------|--------------------------|:---:|---------------------------------|
| GET    | `/api/stays`             | – | List all homestays              |
| GET    | `/api/stays/search?q=`   | – | Search homestays by keyword     |
| GET    | `/api/stays/mine`        | ✅ | Host's own listed stays         |
| GET    | `/api/stays/:id`         | – | Get a single homestay by ID     |
| POST   | `/api/stays`             | ✅ | Create a new homestay listing   |
| PUT    | `/api/stays/:id`         | ✅ | Update an existing homestay     |
| DELETE | `/api/stays/:id`         | ✅ | Delete a homestay               |

**Example — `POST /api/stays`**
```json
// Request
{ "title": "Riverside Cottage", "location": "Rishikesh", "price": 2200, "host": "Ravi" }

// Response 201
{ "_id": "665f...", "title": "Riverside Cottage", "location": "Rishikesh", "price": 2200, "hostId": "665e..." }
```
</details>

<details>
<summary><b>Auth</b></summary>

| Method | Endpoint                       | Auth | Description                              |
|--------|----------------------------------|:---:|--------------------------------------------|
| POST   | `/api/auth/register`            | – | Register with bcrypt-hashed password       |
| POST   | `/api/auth/login`                | – | Login, returns a signed JWT (7-day expiry) |
| GET    | `/api/auth/me`                   | ✅ | Get the current logged-in user             |
| GET    | `/api/auth/hosts`                | ✅ | List all host accounts (for admin linking) |
| POST   | `/api/auth/admin/request-otp`    | – | Request a 6-digit OTP for admin sign-in    |
| POST   | `/api/auth/admin/verify-otp`     | – | Verify OTP and receive a JWT               |
| GET    | `/api/auth/google`               | – | Start Google OAuth flow                    |
| GET    | `/api/auth/google/callback`      | – | Google OAuth callback                      |

**Example — `POST /api/auth/login`**
```json
// Request
{ "email": "traveler@example.com", "password": "••••••••" }

// Response 200
{ "token": "eyJhbGciOi...", "user": { "id": "665e...", "name": "Anita", "userType": "traveler" } }
```
</details>

<details>
<summary><b>Bookings</b> <i>(real-time via Socket.io)</i></summary>

| Method | Endpoint                       | Auth | Description                                      |
|--------|----------------------------------|:---:|-----------------------------------------------------|
| POST   | `/api/bookings`                  | ✅ | Traveler sends a booking request → notifies host live |
| GET    | `/api/bookings/mine`             | ✅ | Traveler's own bookings                            |
| GET    | `/api/bookings/host`             | ✅ | Host's incoming booking requests                    |
| PATCH  | `/api/bookings/:id/status`       | ✅ | Host confirms/declines, or guest cancels — notifies both sides live |
</details>

<details>
<summary><b>AI</b></summary>

| Method | Endpoint                             | Auth (optional) | Description                                   |
|--------|----------------------------------------|:---:|---------------------------------------------------|
| POST   | `/api/ai/trip-planner/picks`           | optional | Returns top 3 matching stays for a description |
| POST   | `/api/ai/trip-planner/itinerary/stream`| optional | Streams a plain-text itinerary for the picks    |
| POST   | `/api/ai/trip-planner/refine`          | optional | Re-ranks picks + itinerary based on a refinement request |
</details>

> Every `✅` route returns **401** if the `Authorization: Bearer <token>` header is missing or invalid.

---

## 🏗️ Architecture / Folder Structure

```mermaid
flowchart LR
    subgraph Client["🖥️ Frontend — React + Socket.io-client"]
        A[Traveler] -->|Sends booking request| B(BookingModal)
        H[Host] -->|Confirms / declines| I(HostDashboard)
    end

    subgraph Server["⚙️ Backend — Express + Socket.io"]
        C[/POST /api/bookings/]
        D[/PATCH /api/bookings/:id/status/]
        E{{Socket.io Server}}
    end

    subgraph DB["🗄️ MongoDB Atlas"]
        F[(Booking)]
        G[(Stay)]
        J[(User)]
    end

    B --> C --> F
    C -->|emit booking:new| E -->|room: host:id| I
    I --> D --> F
    D -->|emit booking:statusUpdate| E -->|room: guest:id| B
    F -.-> G
    F -.-> J
```

```
Vanvas---an-Uttarakhand-homestay-/
├── src/                     # Frontend (React + Vite)
│   ├── components/          # Reusable UI (Navbar, BookingModal, ui/*)
│   ├── context/              # AuthContext, ThemeContext, WishlistContext
│   ├── hooks/                # useWishlist, etc.
│   ├── lib/                  # api.js (fetch wrapper), socket.js, tripPdf.js
│   ├── pages/                 # Route-level pages (Home, Explore, HostDashboard, ...)
│   └── main.jsx / App.jsx
├── backend/                  # Backend (Node + Express)
│   ├── config/                # passport.js (Google OAuth)
│   ├── middleware/            # auth, rateLimiter, validate
│   ├── models/                 # User, Stay, Booking, Trip, Wishlist (Mongoose)
│   ├── routes/                  # auth, bookings, ai, trips, wishlist
│   ├── services/                # geminiService.js
│   └── server.js                # Express + Socket.io entrypoint
├── docs/screenshots/         # README screenshots
└── README.md
```

Database schema:

```mermaid
erDiagram
    USER ||--o{ STAY : "hosts"
    USER ||--o{ BOOKING : "requests (guest)"
    USER ||--o{ BOOKING : "receives (host)"
    STAY ||--o{ BOOKING : "is booked in"

    USER {
        ObjectId _id
        string name
        string email
        string password
        string userType "traveler | host | admin"
        string role "viewer | admin"
    }
    STAY {
        ObjectId _id
        string title
        string location
        number price
        number rating
        array tags
        ObjectId hostId FK
        boolean eco
        string image
    }
    BOOKING {
        ObjectId _id
        ObjectId stay FK
        ObjectId guest FK
        ObjectId host FK
        date checkIn
        date checkOut
        number guests
        number totalPrice
        string status "pending | confirmed | declined | cancelled"
    }
```

**Real-time flow:** the backend runs a Socket.io server alongside the Express API on the same port. A logged-in host joins room `host:{userId}` from the Host Dashboard; a logged-in guest joins `guest:{userId}` from My Bookings. When a booking is created or its status changes, the server emits directly to the relevant room(s).

**Security:** passwords hashed with bcrypt (10 salt rounds); JWTs expire after 7 days; login/register rate-limited to 5 attempts per 15 minutes per IP; every auth request body validated with Zod; CORS locked to the deployed frontend origin(s) via `FRONTEND_URL`.

---

## ⚠️ Known Limitations

- **Free-tier cold starts:** Render's free web service spins down after ~15 minutes of inactivity. The first request after being idle can take 30–60 seconds while it wakes back up.
- **MongoDB Atlas free tier** has connection limits; if you see intermittent DB errors under load, check the Atlas metrics tab.
- **AI features depend on the Gemini API quota** — if the free quota is exhausted, the Trip Planner and Listing Assistant will return a "temporarily unavailable" error until it resets.
- **No automated test suite yet** — testing is currently manual (see Setup Instructions to run locally).
- **Single currency/locale (INR, English/Hindi only)** — not yet localized further.

---

## 🙏 Credits & Acknowledgements

- **AI tools used during development:** Claude (Anthropic) and Google Gemini API (for the in-app AI Trip Planner & Listing Assistant features)
- **Icons/badges:** [Shields.io](https://shields.io)
- **Fonts & design inspiration:** Tailwind CSS documentation, Framer Motion examples
- Built as part of the **TBI-GEU Full Stack Development Internship**, Week 1–10 capstone project

---

<div align="center">

**Built with ♥ in Dehradun** · SNEHA SHARMA

[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat-square&logo=github)](https://github.com/snehasharmaa912-ops)

</div>
