# Smart Waste Management

Full-stack MVP web application for reporting, prioritizing, and managing waste complaints.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT (optional admin/user login included)

## Project Structure

```text
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
frontend/
  src/
    api/
    components/
    context/
    hooks/
    layouts/
    pages/
    utils/
```

## Quick Start

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Default Seeded Accounts

- Admin: `admin@smartwaste.com` / `Admin@123`
- User: `user@smartwaste.com` / `User@123`

## Environment Variables

Backend:

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_URL`

Frontend:

- `VITE_API_URL`

## Notes

- Image upload is handled as an image URL in this MVP for a deployment-friendly starter.
- Optional map picker can be added by integrating Google Maps Places/Maps in the form component.
