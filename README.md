# VolunteerIQ � Volunteering Made Intelligent

<p align="center">
  <a href="https://volunteeriq-client-715375024738.us-central1.run.app">
    <img src="https://img.shields.io/badge/Live-App-0A0A0A?style=for-the-badge&logo=google-cloud&logoColor=white" alt="Live App">
  </a>
  <a href="https://github.com/anomalyco/opencode/issues">
    <img src="https://img.shields.io/badge/Issues-Welcome-red?style=for-the-badge" alt="Issues">
  </a>
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge" alt="Version">
</p>

---

## About VolunteerIQ

**VolunteerIQ** is an AI-powered volunteer coordination platform that intelligently matches volunteers with meaningful opportunities based on skills, location, and availability.

### The Problem 😰

- NGOs struggle to find the right volunteers for urgent tasks
- Fragmented field data from various sources (forms, sheets, manual records)
- Volunteers have no way to find meaningful work near them
- No intelligent prioritization of urgent humanitarian needs

### Our Solution 💡

- **Unified Dashboard** - Collect all field data in one place
- **AI-Powered Matching** - Smart algorithms match volunteers with tasks
- **Real-time Maps** - Visualize need heatmaps and volunteer coverage
- **Impact Tracking** - Track volunteer hours and contribution

---

## Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Matching** | Google Gemini-powered volunteer-task matching |
| 🗺️ **Interactive Maps** | Google Maps with task heatmaps |
| 📊 **Analytics Dashboard** | Real-time insights and impact metrics |
| 👥 **Volunteer Management** | Skill tracking and performance metrics |
| 📱 **CSV Import** | Bulk volunteer/task import |
| 🔐 **Authentication** | Secure auth with Supabase |

---

## Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5-764ABC?style=for-the-badge)
![Recharts](https://img.shields.io/badge/Recharts-3-9F5F9F?style=for-the-badge)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)

### AI & Database
![Google Gemini](https://img.shields.io/badge/Gemini_AI-2.0-FAB400?style=for-the-badge)
![Supabase](https://img.shields.io/badge/Supabase-3-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-13-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

### Infrastructure
![Google Cloud Run](https://img.shields.io/badge/Cloud_Run-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)

---

## Live URLs

| Service | URL |
|---------|-----|
| **Frontend** | https://volunteeriq-client-715375024738.us-central1.run.app |
| **Backend API** | https://volunteeriq-server-715375024738.us-central1.run.app |
| **Health Check** | https://volunteeriq-server-715375024738.us-central1.run.app/api/v1/health |

---

## Architecture

```
┌───────────────────────────────────────────────��─────────────────────────┐
│                           USER LAYER                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │ Landing  │  │ Sign In  │  │ Dashboard│  │  Admin   │               │
│  │   Page   │  │ / SignUp │  │  Page    │  │  Panel   │               │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘               │
└───────┼──────────────┼──────────────┼──────────────┼──────────────────────┘
        │              │              │              │
        │    ┌────────▼────────▼────────▼────────┐ │
        │    │         REACT ROUTER              │ │
        │    │    /login, /signup, /dashboard    │ │
        │    └──────────────┬──────────────────┘ │
        │                   │                      │
        └───────────────────┼──────────────────────┘
                            │ HTTP Requests
        ┌───────────────────▼─────────────────────────────────┐
        │                  NGINX PROXY                         │
        │              (Cloud Run Container)                  │
        │         /api/* → Backend Server                     │
        │         /     → Frontend Static                     │
        └───────────────────────┬───────────────────────────────┘
                               │
        ┌───────────────────────▼─────────────────────────────────┐
        │                  BACKEND SERVER                        │
        │              (Express on Cloud Run)                    │
        │                                                            │
        │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
        │  │ Auth Routes │  │ Task Routes │  │ Match Routes│   │
        │  │ /api/auth   │  │ /api/tasks  │  │ /api/match  │   │
        │  └─────────────┘  └─────────────┘  └─────────────┘   │
        │                                                            │
        │  ┌─────────────────────────────────────────────────┐   │
        │  │              AI SERVICES                         │   │
        │  │         Google Gemini API                        │   │
        │  │    (Smart volunteer-task matching)              │   │
        │  └─────────────────────────────────────────────────┘   │
        └───────────────────────┬───────────────────────────────┘
                               │
        ┌───────────────────────▼─────────────────────────────────┐
        │                  DATABASE                             │
        │              (Supabase + Firebase)                    │
        │                                                            │
        │  ┌─────────────┐  ┌─────────────┐                     │
        │  │ Volunteers  │  │    Tasks    │                     │
        │  │    JSON    │  │    JSON    │                     │
        │  └─────────────┘  └─────────────┘                     │
        └───────────────────────────────────────────────────────┘
```

---

## Data Flow

```
┌────────────────────────────────────────────────────────────────────┐
│                    VOLUNTEER SIGNUP FLOW                            │
└────────────────────────────────────────────────────────────────────┘

   ┌──────────┐     ┌──────────────┐     ┌─────────────┐
   │ Volunteer│────▶│ Sign Up Form  │────▶│  API POST   │
   │  visits  │     │              │     │ /api/auth   │
   └──────────┘     └──────────────┘     └──────┬──────┘
                                                  │
                                                  ▼
                                 ┌──────────────────────────────┐
                                 │   Validate & Create User   │
                                 │   Store in Supabase Auth   │
                                 └──────────────┬───────────┘
                                                │
                                                ▼
                                 ┌──────────────────────────────┐
                                 │   Return JWT Token           │
                                 │   Redirect to Dashboard      │
                                 └──────────────────────────────┘


┌────────────────────────────────────────────────────────────────────┐
│                      TASK MATCHING FLOW                            │
└────────────────────────────────────────────────────────────────────┘

   ┌──────────┐     ┌──────────────┐     ┌─────────────┐
   │  Admin   │────▶│ Create Task   │────▶│  API POST   │
   │ creates  │     │              │     │ /api/tasks  │
   └──────────┘     └──────────────┘     └──────┬──────┘
                                                  │
                                                  ▼
                                 ┌──────────────────────────────┐
                                 │   Calculate Priority Score │
                                 │   (urgency, distance,      │
                                 │    skills, capacity)      │
                                 └──────────────┬───────────┘
                                                │
                                                ▼
                                 ┌──────────────────────────────┐
                                 │   AI Match with Gemini      │
                                 │   Find best volunteers      │
                                 └──────────────┬───────────┘
                                                │
                                                ▼
                                 ┌──────────────────────────────┐
                                 │   Display in Dashboard      │
                                 │   Show match score %        │
                                 └──────────────────────────────┘
```

---

## Project Structure

```
VolunteerIQ/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── api/              # API client
│   │   ├── components/        # Shared UI components
│   │   │   ├── layout/       # Layout components
│   │   │   └── ui/           # Button, Card, Input, etc.
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   ├── pages/           # Page components
│   │   │   ├── admin/        # Admin dashboard pages
│   │   │   ├── map/          # Map view
│   │   │   ├── notifications/# Notifications
│   │   │   ├── tasks/       # Task management
│   │   │   └── volunteers/   # Volunteer pages
│   │   ├── store/           # Zustand stores
│   │   └── index.css        # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
│
├── server/                    # Express Backend
│   ├── routes/               # API routes
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   ├── volunteers.js
│   │   ├── match.js
│   │   └── score.js
│   ├── services/            # Business logic
│   │   ├── supabase.js
│   │   ├── gemini.js
│   │   └── scorer.js
│   ├── middleware/          # Auth middleware
│   ├── index.js             # Server entry
│   ├── package.json
│   └── Dockerfile
│
├── docs/                     # Documentation & Screenshots
│   └── screenshots/
│
└── README.md                 # This file
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Docker
- Google Cloud CLI

### Local Development

```bash
# Clone the repository
git clone https://github.com/shikhar/VolunteerIQ.git
cd VolunteerIQ

# Install client dependencies
cd client && npm install

# Install server dependencies  
cd ../server && npm install

# Set up environment variables
cp client/.env.example client/.env
cp server/.env.example server/.env

# Edit .env files with your credentials

# Start development servers
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

### Environment Variables

**Client (.env):**
```env
VITE_API_URL=http://localhost:5000
VITE_DEV_MODE=true
VITE_GOOGLE_MAPS_KEY=your_maps_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

**Server (.env):**
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
GEMINI_API_KEY=your_gemini_key
CORS_ORIGIN=*
DEV_MODE=false
```

---

## Deployment

### Build & Deploy

```bash
# Build client Docker image
gcloud builds submit --tag gcr.io/PROJECT_ID/volunteeriq-client ./client

# Deploy to Cloud Run
gcloud run deploy volunteeriq-client \
  --image gcr.io/PROJECT_ID/volunteeriq-client \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## Screenshots

![Landing Page](docs/Screenshot%202026-04-28%20at%2011.26.08%20PM.png)
![Dashboard](docs/Screenshot%202026-04-28%20at%2011.26.13%20PM.png)
![Admin Panel](docs/Screenshot%202026-04-28%20at%2011.26.18%20PM.png)
![Task Management](docs/Screenshot%202026-04-28%20at%2011.26.29%20PM.png)
![Analytics](docs/Screenshot%202026-04-28%20at%2011.26.42%20PM.png)
![Volunteer Profile](docs/Screenshot%202026-04-28%20at%2011.26.47%20PM.png)
![Map View](docs/Screenshot%202026-04-28%20at%2011.26.58%20PM.png)
![Login Page](docs/Screenshot%202026-04-28%20at%2011.27.06%20PM.png)

---

## License

<p align="center">
  MIT License · © 2026 VolunteerIQ
</p>

---

<div align="center">
  
  ### Made with ❤️ for social impact
  
  ![VolunteerIQ](client/src/assets/hero.png)
  
</div>