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

---

## 🗄️ Database

VanaVas uses **MongoDB Atlas** (cloud-hosted, free M0 tier) as its database, chosen because the homestay data is naturally document-shaped — flexible fields like `tags` (an array) and optional properties fit cleanly into a NoSQL document model without needing rigid relational tables. Mongoose is used as the ODM to define schemas and interact with the database from Express.

### Schema Diagram


![VanaVas Database Schema](./W5_SchemaDiagram_%5BTBI-26100445%5D.png)


The platform currently has one core entity, `Stay`, representing a single homestay listing with fields for title, location, price, rating, tags, host name, eco-certification status, and an image URL.

### Set up the database

1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new project and an M0 (free tier) cluster
3. Under **Database Access**, create a database user with a username and password
4. Under **Network Access**, add `0.0.0.0/0` to allow connections from anywhere
5. Click **Connect → Drivers → Node.js** to get your connection string
6. Add it to your backend environment variables as `MONGO_URI`:
 MONGO_URI=mongodb+srv://:@/vanavas?appName=VanaVas
7. The backend connects automatically via Mongoose on startup
   

## ✨ AI Features

1. **AI Trip Planner** — Traveler describes their ideal stay and AI recommends top 3 homestays with a 3-day itinerary
2. **AI Listing Assistant** — Hosts fill a simple Hindi form and AI generates a clean English property description

---

Built with ♥ in Dehradun | SNEHA SHARMA
