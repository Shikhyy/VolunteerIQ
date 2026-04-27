# VolunteerIQ — Smart Resource Allocation Platform
### Google Solution Challenge 2026 · Build with AI

> An AI-powered coordination platform that consolidates local need signals and intelligently maps volunteers to the highest-priority tasks and regions.

---

## What This Is

VolunteerIQ is a full-stack web application that helps NGOs and community organizations:

- Collect fragmented field data from forms, sheets, and local records into one dashboard
- Use AI to score and prioritize tasks by urgency, location, and available volunteer skills
- Match volunteers to tasks intelligently — the right person, at the right place, at the right time
- Visualize need heatmaps and volunteer coverage gaps on a live map

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS |
| Maps | Google Maps JS API + @react-google-maps/api |
| AI Matching | Google Gemini API (gemini-2.0-flash) |
| Backend | Node.js + Express |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Hosting | Firebase Hosting + Cloud Run |
| State | Zustand |
| Charts | Recharts |

---

## Repo Structure

```
volunteer-iq/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── pages/           # Route-level page components
│   │   ├── components/      # Shared UI components
│   │   ├── features/        # Feature modules (volunteers, tasks, map, admin)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── store/           # Zustand state slices
│   │   ├── services/        # API + Firebase calls
│   │   └── utils/           # Helpers (scoring, formatting)
│   └── public/
├── server/                  # Node + Express API
│   ├── routes/
│   ├── services/
│   │   ├── gemini.js        # Gemini AI matching engine
│   │   ├── firebase.js      # Firestore read/write
│   │   └── scorer.js        # Task priority scoring logic
│   └── index.js
├── firebase/
│   ├── firestore.rules
│   └── firestore.indexes.json
├── docs/                    # All planning documents (this folder)
└── README.md
```

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/your-username/volunteer-iq.git
cd volunteer-iq

# 2. Install dependencies
cd client && npm install
cd ../server && npm install

# 3. Set up environment variables
cp client/.env.example client/.env.local
cp server/.env.example server/.env

# 4. Start development servers
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

App runs at `http://localhost:5173`

---

## Key Features for Judges

- **AI Task Matching** — Gemini 2.0 scores volunteer-task fit based on skills, location, availability
- **Live Need Heatmap** — Google Maps showing task density and coverage gaps  
- **Priority Scoring** — Multi-factor algorithm (urgency + distance + skill match + capacity)
- **Admin Dashboard** — NGO admin can manage volunteers, approve tasks, view analytics
- **Volunteer Portal** — Self-service signup, skill profiling, task acceptance
- **Field Data Ingestion** — CSV upload + manual entry for offline field reports

---

## Implementation Plan

| Phase | Goal | Timeline |
|---|---|---|
| Phase 1 | Foundation — auth, routing, Firebase connection | Days 1–2 |
| Phase 2 | Volunteer module — signup, profile, task list | Days 3–4 |
| Phase 3 | Task module — creation, CSV import, priority scoring | Days 5–6 |
| Phase 4 | AI matching — Gemini integration | Days 7–8 |
| Phase 5 | Map view — heatmap and coverage visualization | Days 9–10 |
| Phase 6 | Admin dashboard — analytics and management | Days 11–12 |
| Phase 7 | Polish, testing, demo prep | Days 13–14 |

---

## Submission Checklist

- [ ] Live prototype link (Firebase Hosting URL)
- [ ] GitHub repository (public, runnable)
- [ ] Phase 1: Foundation — auth, routing, Firebase connection
- [ ] Phase 2: Volunteer module — signup, profile, task list
- [ ] Phase 3: Task module — creation, CSV import, priority scoring
- [ ] Phase 4: AI matching — Gemini integration
- [ ] Phase 5: Map view — heatmap and coverage visualization
- [ ] Phase 6: Admin dashboard — analytics and management
- [ ] Phase 7: Polish — testing, demo video

---

## Team

| Name | Role |
|---|---|
| — | Full-stack + AI integration |
| — | UI/UX + Frontend |
| — | Backend + Firebase |
| — | Research + Documentation |
