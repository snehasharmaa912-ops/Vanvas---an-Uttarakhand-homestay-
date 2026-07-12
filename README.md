<div align="center">

# 🏔️ VanaVas
### Uttarakhand Homestay & Eco-stay Platform

*Connecting rural homestay owners across Uttarakhand with eco-conscious travelers — in real time.*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-vanavas.vercel.app-2d7a4f?style=for-the-badge&logo=vercel&logoColor=white)](https://vanvas-an-uttarakhand-homestay.vercel.app)
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
- [Feature Highlights](#-feature-highlights)
- [Screenshots](#-screenshots)
- [Architecture](#-architecture)
- [Database Schema](#️-database-schema)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Security](#-security)
- [Real-time Flow](#-real-time-flow)
- [AI Features](#-ai-features)

---

## 🌿 What it does

Rural homestay hosts in Uttarakhand have no digital presence — they rely on word-of-mouth or pay 30–40% commissions to agents. **VanaVas** gives them a simple platform to list, manage, and earn directly from travelers.

Travelers get a curated, verified, and genuinely local experience — searchable by district, budget, stay type, and eco-rating — and can send a booking request that reaches the host **instantly**, with live status updates as the host responds.

---

## ✨ Feature Highlights

<table>
<tr>
<td width="50%">

**🔐 Secure Authentication**
bcrypt-hashed passwords, JWT sessions, Google OAuth one-click sign-in, and a 6-digit email OTP flow for admin access

**🛡️ Protected Routes**
API (`requireAuth` middleware) and frontend (`ProtectedRoute` component) routes both reject/redirect unauthenticated access

**⚡ Real-time Booking**
Requests appear on the host's dashboard live via WebSocket — no refresh, no polling

</td>
<td width="50%">

**🧑‍🌾 Role-based Experience**
Traveler, host, and admin each get a tailored view and permission set

**🎬 Polished Micro-interactions**
Page transitions, scroll-reveal cards, animated wishlist hearts, spring nav indicators — built with Framer Motion

**🚦 Rate Limiting & Validation**
Zod schema validation on every auth endpoint, 5-attempts/15-min throttling

</td>
</tr>
</table>

---

## 📸 Screenshots

<div align="center">

| Home | Explore | Host Dashboard |
|:---:|:---:|:---:|
| *add screenshot here* | *add screenshot here* | *add screenshot here* |

</div>

> 💡 Replace the placeholders above: drag your screenshots into a GitHub issue or comment first to get a hosted image URL, then swap it in — e.g. `![Home](https://github.com/user-attachments/assets/your-image-id)`. This is the fastest way to embed images without adding files to the repo.

---

## 🏗️ Architecture

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

---

## 🗄️ Database Schema

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
| AI             | LLM API                                               |
| Deploy         | Vercel (frontend) + Render (backend)                  |

---

## 🚀 Getting Started

### Frontend

```bash
git clone https://github.com/snehasharmaa912-ops/anavas.git
cd vanavas
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### Backend

```bash
cd backend
npm install
npm run dev
```
The API + Socket.io server runs at [http://localhost:5000](http://localhost:5000)

<details>
<summary><b>Environment variables (<code>backend/.env</code>)</b> — click to expand</summary>

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
```
</details>

---

## 📡 API Reference

<details open>
<summary><b>Stays</b></summary>

| Method | Endpoint                | Auth | Description                    |
|--------|--------------------------|:---:|---------------------------------|
| GET    | `/api/stays`             | – | List all homestays              |
| GET    | `/api/stays/search?q=`   | – | Search homestays by keyword     |
| GET    | `/api/stays/:id`         | – | Get a single homestay by ID     |
| POST   | `/api/stays`             | ✅ | Create a new homestay listing   |
| PUT    | `/api/stays/:id`         | ✅ | Update an existing homestay     |
| DELETE | `/api/stays/:id`         | ✅ | Delete a homestay               |
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

> Every `✅` route returns **401** if the `Authorization: Bearer <token>` header is missing or invalid.

---

## 🔐 Security

- 🔒 Passwords hashed with **bcrypt** (10 salt rounds) — plaintext never stored or returned
- 🔑 JWTs signed with a server-side secret, expire after **7 days**
- 🚦 Login/register rate-limited to **5 attempts per 15 minutes** per IP
- ✅ Every auth request body validated with **Zod** before touching the database
- 🌐 CORS locked to the deployed frontend origin(s) via `FRONTEND_URL`

---

## ⚡ Real-time Flow

The backend runs a **Socket.io** server alongside the Express API on the same port. Clients join per-role "rooms":

- A logged-in **host** joins `host:{userId}` from the Host Dashboard
- A logged-in **guest** joins `guest:{userId}` from My Bookings

When a booking is created or its status changes, the server emits directly to the relevant room(s) — a host sees a new request the instant it's sent, and a traveler sees a confirmation/decline the instant the host responds.

---

## 🤖 AI Features

1. **AI Trip Planner** — Traveler describes their ideal stay and AI recommends top 3 homestays with a 3-day itinerary
2. **AI Listing Assistant** — Hosts fill a simple Hindi form and AI generates a clean English property description

---

<div align="center">

**Built with ♥ in Dehradun** · SNEHA SHARMA

[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat-square&logo=github)](https://github.com/snehasharmaa912-ops)

</div>
