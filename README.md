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

- **Node.js** v18+
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

Create a `.env` file in `/server`:
```env
PORT=5000
# For local local testing:
MONGO_URI=mongodb://localhost:27017/client-lead-crm

# Or for MongoDB Atlas Cloud:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster0.../client-lead-crm

JWT_SECRET=your_super_secret_key_here
```

Seed the admin user:
```bash
node seeds/adminSeed.js
```

Start the backend:
```bash
node server.js
```

### 3. Setup Frontend

```bash
cd client
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and proxies API calls to port 5000.

---

## 🔐 Default Admin Credentials

| Field    | Value          |
|----------|----------------|
| Email    | admin@crm.com  |
| Password | admin123       |

> ⚠️ Change these in production!

---

## 📊 API Endpoints

### Auth
| Method | Endpoint         | Access  | Description        |
|--------|------------------|---------|--------------------|
| POST   | /api/auth/login  | Public  | Admin login        |
| GET    | /api/auth/me     | Private | Get current user   |

### Leads
| Method | Endpoint             | Access  | Description                 |
|--------|----------------------|---------|-----------------------------|
| POST   | /api/leads           | Public  | Create lead (contact form)  |
| GET    | /api/leads           | Private | Get all leads + analytics   |
| GET    | /api/leads/:id       | Private | Get single lead             |
| PUT    | /api/leads/:id       | Private | Update lead                 |
| DELETE | /api/leads/:id       | Private | Delete lead                 |

### Notes
| Method | Endpoint                 | Access  | Description       |
|--------|--------------------------|---------|-------------------|
| POST   | /api/leads/:id/notes     | Private | Add note to lead  |
| GET    | /api/leads/:id/notes     | Private | Get lead notes    |

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
