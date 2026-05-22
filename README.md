# TutorFlow 🎓

> AI-Powered Tutoring Appointment Platform

TutorFlow is a full-stack web application where students can discover tutoring services, book sessions, and receive AI-generated summaries of every lesson — so they always know exactly what to study next.

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React.js, React Router, Axios     |
| Backend  | Node.js, Express.js               |
| Database | MongoDB + Mongoose                |
| Auth     | JSON Web Tokens (JWT) + bcryptjs  |
| AI       | Google Gemini API              |
| Deploy   | Vercel (frontend), Render (backend), MongoDB Atlas (DB) |

---

## Key Features

- **User Authentication** — Register, login, and protected routes via JWT
- **Service Browsing** — Browse and filter tutoring services by subject and grade level
- **Appointment Booking** — Pick a service, date, and time slot to book a session
- **Booking Dashboard** — View upcoming, completed, and cancelled bookings
- **AI Session Summary Generator** — Enter session notes and receive a structured AI summary with key topics, takeaways, and follow-up recommendations
- **Admin Panel** — Create, edit, and delete services; view all platform bookings
- **Responsive Design** — Fully usable on mobile and desktop

---

## AI-Powered Feature: Session Summary Generator

After a tutoring session, students can open the **AI Summary** feature from their dashboard. They enter freeform notes about what was covered and any difficulties they encountered. TutorFlow sends this to the **Google Gemini API**, which returns a structured summary including:

- Session Overview
- Key Topics Covered
- Main Takeaways
- Suggested Follow-Up Topics
- Encouragement message

The summary is saved to the booking record in MongoDB and can be viewed again at any time.

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/tutorflow.git
cd tutorflow
```

### 2. Backend setup
```bash
cd server
npm install
# Fill in your values in .env
npm run dev
```

### 3. Frontend setup
```bash
cd client
npm install
# Set VITE_API_URL=http://localhost:5000
npm run dev
```

---

## Environment Variables

### Backend (`server/.env`)
```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/tutorflow
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)
```
VITE_API_URL=http://localhost:5000
```

---

## Running the App

**Backend:** `cd server && npm run dev` → runs on http://localhost:5000

**Frontend:** `cd client && npm run dev` → runs on http://localhost:5173

---

## Deployment

| Component | Platform       | Notes                                      |
|-----------|----------------|---------------------------------------------|
| Frontend  | Vercel         | Connect GitHub repo, set `VITE_API_URL`     |
| Backend   | Render         | Web service, set all env vars in dashboard  |
| Database  | MongoDB Atlas  | Free tier cluster, whitelist `0.0.0.0/0`   |

**Live App:** https://tutorflow-one.vercel.app

**Backend API:** https://tutorflow-server-me20.onrender.com
---

## How AI Was Used During Development

AI tools were used throughout the development lifecycle:
- Brainstorming the feature set, user stories, and project scope
- Generating starter code for Express routes, Mongoose models, and React components
- Debugging CORS configuration and JWT middleware issues
- Improving React component structure and CSS organization
- Drafting documentation and README content

All AI-generated output was reviewed, tested, and validated before inclusion. Final architecture decisions, debugging, and deployment were handled by the developer.

---

## Project Structure

```
tutorflow/
├── server/
│   ├── config/         # MongoDB connection
│   ├── controllers/    # Route logic (auth, services, bookings, AI)
│   ├── middleware/     # JWT auth + admin guard
│   ├── models/         # Mongoose schemas (User, Service, Booking)
│   ├── routes/         # Express route definitions
│   └── index.js        # App entry point
└── client/
    └── src/
        ├── components/ # Navbar, ServiceCard, BookingCard, AISummaryModal
        ├── context/    # AuthContext (global auth state)
        ├── pages/      # HomePage, ServicesPage, Dashboard, Admin, Auth
        └── services/   # Axios API client
```
