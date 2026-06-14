# VanaVas 🏔️
### Uttarakhand Homestay & Eco-stay Platform

A full-stack web platform connecting rural homestay owners across Uttarakhand with eco-conscious travelers. Built as part of the TBI-GEU AI-Assisted Full Stack Internship (Summer 2026).

---

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
| AI        | LLM API (Week 7)            |
| Deploy    | Vercel + Render (Week 9)    |

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── Navbar.jsx        # Sticky nav with mobile menu
│   ├── Hero.jsx          # Landing hero with search
│   ├── HomestayCard.jsx  # Reusable listing card
│   └── Footer.jsx        # Rich footer with links
├── pages/
│   ├── Home.jsx          # Landing page
│   ├── Explore.jsx       # Browse + filter listings
│   ├── About.jsx         # About + build roadmap
│   └── Login.jsx         # Auth for travelers & hosts
├── App.jsx               # Routes
└── main.jsx              # Entry point
```

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/yourusername/vanavas.git
cd vanavas

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📅 10-Week Build Roadmap

- [x] Week 1 — Orientation & project setup
- [x] Week 2 — Frontend foundations (this week)
- [ ] Week 3 — UI/UX & component design
- [ ] Week 4 — Backend API (Node + Express)
- [ ] Week 5 — Database (MongoDB Atlas)
- [ ] Week 6 — Authentication & security
- [ ] Week 7 — AI API integration
- [ ] Week 8 — Frontend integration & polish
- [ ] Week 9 — Deployment & go-live
- [ ] Week 10 — Capstone & portfolio

---

## ✨ AI Features (Week 7)

1. **AI Trip Planner** — Traveler describes their ideal stay and AI recommends top 3 homestays with a 3-day itinerary
2. **AI Listing Assistant** — Hosts fill a simple Hindi form and AI generates a clean English property description

---

Built with ♥ in Dehradun · TBI-GEU Summer Internship 2025
