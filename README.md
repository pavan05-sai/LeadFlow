# LeadFlow CRM — Client Lead Management System

A complete Mini CRM for freelancers, agencies, and startups to manage client leads, track status, and add follow-up notes — all through a secure admin dashboard.

---

## 🧱 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React.js (Vite) + TailwindCSS v4 |
| Backend    | Node.js + Express.js              |
| Database   | MongoDB + Mongoose                |
| Auth       | JWT + bcrypt                      |
| HTTP       | Axios                             |

---

## 📁 Project Structure

```
/client              → React frontend (Vite)
  /src
    /components      → Reusable UI components
    /context         → Auth context provider
    /pages           → Login, Dashboard
    /services        → Axios API service

/server              → Express backend
  /config            → DB connection
  /controllers       → Auth & Lead logic
  /middleware        → JWT auth middleware
  /models            → Mongoose schemas
  /routes            → API routes
  /seeds             → Admin seed script
```

---

## ⚡ Setup Instructions

### Prerequisites

- **Node.js** v22.12 or later
- **MongoDB** running locally or a MongoDB Atlas URI

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd "Client Lead Management System"
```

### 2. Setup Backend

```bash
cd server
npm install
```

Copy `server/.env.example` to `server/.env` and provide your own values:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET=<random-secret-at-least-32-characters>
CORS_ORIGINS=http://localhost:5173
ADMIN_NAME=Administrator
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=<unique-password-at-least-12-characters>
```

Create the initial administrator (the script never prints the password):
```bash
npm run seed
```

Start the API:
```bash
npm start
```

The API listens on `PORT` and exposes `GET /api/health` as a database-readiness
check. Configure `CORS_ORIGINS` as a comma-separated list of exact frontend
origins in production. Never commit `.env` files or use sample credentials.

### 3. Setup Frontend

```bash
cd client
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and proxies API calls to port 5000.
For a separate production frontend/API deployment, build with
`VITE_API_URL=https://your-api.example.com/api` and set the API's
`CORS_ORIGINS` to the frontend origin.

### Production checks

```bash
cd client
npm run lint
npm run build
cd ../server
npm test
```

---

## 🔐 Administrator credentials

There are no default credentials. Set `ADMIN_EMAIL` and a unique
`ADMIN_PASSWORD` in the server environment before running `npm run seed`.

---

## ✨ Features

- ✅ JWT-based admin authentication
- ✅ Lead CRUD with status management (New → Contacted → Converted)
- ✅ Follow-up notes per lead
- ✅ Search and filter leads
- ✅ Sort by date, name, or status
- ✅ Dashboard analytics (total, new, contacted, converted, conversion rate)
- ✅ Responsive dark-mode UI with glassmorphism design
- ✅ Real-time UI updates after changes

---

## 📝 License

ISC
