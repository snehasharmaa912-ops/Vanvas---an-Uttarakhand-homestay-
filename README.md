# VanaVas 🏔️
### Uttarakhand Homestay & Eco-stay Platform

A full-stack web platform connecting rural homestay owners across Uttarakhand with eco-conscious travelers. Built as part of the TBI-GEU AI-Assisted Full Stack Internship (Summer 2026).

---

## Live Demo : https://vanvas-an-uttarakhand-homestay.vercel.app

## 🌿 What it does

Rural homestay hosts in Uttarakhand have no digital presence — they rely on word-of-mouth or pay 30–40% commissions to agents. VanaVas gives them a simple platform to list, manage, and earn directly from travelers.

Travelers get a curated, verified, and genuinely local experience — searchable by district, budget, stay type, and eco-rating.

---

## ⚡ Tech Stack

| Layer     | Technology                  |
|-----------|-----------------------------|
| Frontend  | React.js + Tailwind CSS     |
| Backend   | Node.js + Express.js        |
| Database  | MongoDB (Atlas)             |
| AI        | LLM API                     |
| Deploy    | Vercel + Render             |

---

## 🚀 Getting Started (Frontend)

```bash

git clone https://github.com/snehasharmaa912-ops/anavas.git
cd vanavas
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🖥️ How to Run the Backend Locally

The backend is a separate Express server located in the `/backend` folder.

```bash

cd backend
npm install
npm run dev
```

The API will be running at [http://localhost:5000](http://localhost:5000)

### Available Endpoints

| Method | Endpoint                | Description                  |
|--------|--------------------------|-------------------------------|
| GET    | `/api/stays`             | List all homestays            |
| GET    | `/api/stays/search?q=`   | Search homestays by keyword   |
| GET    | `/api/stays/:id`         | Get a single homestay by ID   |
| POST   | `/api/stays`             | Create a new homestay listing |
| PUT    | `/api/stays/:id`         | Update an existing homestay   |
| DELETE | `/api/stays/:id`         | Delete a homestay             |

---

## ✨ AI Features

1. **AI Trip Planner** — Traveler describes their ideal stay and AI recommends top 3 homestays with a 3-day itinerary
2. **AI Listing Assistant** — Hosts fill a simple Hindi form and AI generates a clean English property description

---

Built with ♥ in Dehradun | SNEHA SHARMA
