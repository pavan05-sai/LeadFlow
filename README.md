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

### Deploy the frontend to Vercel and the API to Render

1. **Verify the Atlas connection string.** In Atlas, open **Database → Connect
   → Drivers** and copy the Node.js connection URI. Set `MONGO_URI` in Render
   to the complete URI, starting with `mongodb+srv://` (or `mongodb://` for a
   standard deployment). Replace the username, password, cluster, and database
   placeholders with the actual values. If the database password contains
   reserved URL characters, URL-encode them. Keep the value in deployment
   secrets; do not paste it into GitHub, source files, or chat.
2. **Allow Render to reach Atlas.** In Atlas **Network Access**, allow the
   outbound IP addresses shown for the Render service. In **Database Access**,
   use a dedicated database user with a strong password and only the access
   needed for the application.
3. **Create the Render API.** In Render, create a **Blueprint** from this
   repository and select `render.yaml`, or create a Node web service manually
   with root directory `server`, build command `npm ci`, start command
   `npm start`, and health-check path `/api/health`. Set `MONGO_URI`,
   `CORS_ORIGINS`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in Render's environment
   settings. Use the Vercel production origin for `CORS_ORIGINS` (for example,
   `https://your-app.vercel.app`), with no path or trailing slash. Render
   generates `JWT_SECRET` when the Blueprint is created.
4. **Create the first admin.** After the Render API is deployed and configured,
   use its Shell to run `npm run seed` from the service root. The seed command
   uses `ADMIN_EMAIL` and `ADMIN_PASSWORD` from the service environment and is
   safe to rerun for the same existing admin.
5. **Deploy the Vercel frontend.** Import this repository into Vercel and set
   the project root directory to `client`. The checked-in `client/vercel.json`
   configures the Vite build and SPA route fallback. Set `VITE_API_URL` in
   Vercel's Production environment to the Render API URL ending in `/api`,
   such as `https://your-api.onrender.com/api`, then deploy/redeploy.
6. **Verify the deployment.** Open the Render URL plus `/api/health`; it must
   return HTTP 200 and `"database":"connected"`. Then visit the Vercel site,
   sign in with the admin credentials, and test the dashboard and contact form.

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
