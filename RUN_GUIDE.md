# SecureChat Run Guide

This is the deployment-ready run guide for SecureChat. It covers the exact steps needed to run the app locally and prepare it for production deployment.

---

## 1. Project overview

SecureChat is a cybersecurity awareness platform built with:

- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL
- Real-time: Socket.IO
- AI: Ollama
- Auth: JWT + bcryptjs
- Deployment targets: Vercel and Netlify

Important: the app must be deployed with a real PostgreSQL database and a running Ollama instance.

---

## 2. Prerequisites

Before running anything, install:

- Node.js 18+
- npm
- PostgreSQL 12+
- Ollama
- Git

Install Ollama from https://ollama.ai and then pull a model:

```bash
ollama pull mistral
```

Check that Ollama is running:

```bash
ollama serve
curl http://localhost:11434/api/tags
```

---

## 3. Clone and install

From the project root:

```bash
cd SecureChat

cd backend
npm install

cd ../frontend
npm install
```

---

## 4. Create database

Create a PostgreSQL database for the app. Example:

```sql
CREATE DATABASE securechat_db;
```

If you use PostgreSQL locally with a default user:

```bash
psql -U postgres
CREATE DATABASE securechat_db;
\q
```

---

## 5. Configure environment files

### Backend env

Create `backend/.env` from `backend/.env.example`:

```bash
cd backend
cp .env.example .env
```

Use this shape:

```env
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=securechat_db
DB_USER=postgres
DB_PASSWORD=your_password
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/securechat_db
DB_POOL_MAX=5

OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral

JWT_SECRET=change_this_to_a_strong_32_plus_character_secret
JWT_EXPIRE=7d

FRONTEND_URL=http://localhost:3000
LOG_LEVEL=info
```

Notes:
- `DATABASE_URL` is the main production-friendly value.
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` are used in local development.
- `OLLAMA_BASE_URL` must point to a reachable Ollama server.
- `JWT_SECRET` must be strong and kept secret.

### Frontend env

Create `frontend/.env` from `frontend/.env.example`:

```bash
cd ../frontend
cp .env.example .env
```

Use this shape:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=SecureChat
VITE_APP_VERSION=1.0.0
```

For deployed production, change to your deployed backend URLs:

```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_SOCKET_URL=https://your-backend-domain.com
```

---

## 6. Run database migrations

From the backend folder:

```bash
cd backend
npm run db:migrate
```

Optional seed data:

```bash
npm run db:seed
```

---

## 7. Run the app locally

Open 3 separate terminals.

### Terminal 1: Ollama

```bash
ollama serve
```

### Terminal 2: Backend

```bash
cd SecureChat/backend
npm run dev
```

### Terminal 3: Frontend

```bash
cd SecureChat/frontend
npm run dev
```

Expected URLs:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/health

---

## 8. Login flow

The app does not auto-login.

Use the app manually:

1. Open http://localhost:3000
2. Click Register or Sign in
3. Enter a valid email and password
4. Passwords must meet the configured minimum length requirement
5. After login, the app stores the JWT token locally and uses it for protected requests

---

## 9. Production deployment checklist

Before deployment, confirm all of the following:

- PostgreSQL database is created and reachable
- Ollama is running and reachable over the network
- `JWT_SECRET` is set in production and not committed to source control
- `FRONTEND_URL` is set to the live frontend domain
- CORS is configured for the production frontend domain
- `VITE_API_URL` and `VITE_SOCKET_URL` match the deployed backend URL
- Node version is 18 or newer
- Environment variables are set in the deployment platform, not in git

---

## 10. Deploy to Vercel

### Requirements

- GitHub repo connected to Vercel
- Managed PostgreSQL database (Supabase, Railway, Neon, Render, etc.)
- Ollama instance reachable from the deployed backend

### Environment variables for Vercel

Set these in the Vercel project dashboard:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/securechat_db
OLLAMA_BASE_URL=https://your-ollama-instance.com
OLLAMA_MODEL=mistral
JWT_SECRET=very_long_random_secret_here
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Important note

The frontend build should use the deployed backend URL. In `frontend/.env` or platform env vars, set:

```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_SOCKET_URL=https://your-backend-domain.com
```

Then deploy.

---

## 11. Deploy to Netlify

### Requirements

- Repo connected to Netlify
- PostgreSQL database available outside localhost
- Ollama running on a reachable public or private network endpoint

### Environment variables for Netlify

Add these in Site settings → Environment variables:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/securechat_db
OLLAMA_BASE_URL=https://your-ollama-instance.com
OLLAMA_MODEL=mistral
JWT_SECRET=very_long_random_secret_here
JWT_EXPIRE=7d
FRONTEND_URL=https://your-netlify-domain.netlify.app
```

Also set frontend values in the build environment if needed:

```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_SOCKET_URL=https://your-backend-domain.com
```

Then trigger a deploy.

---

## 12. Docker option

If you want to run the app with Docker, use:

```bash
docker-compose up --build
```

Then run migrations:

```bash
docker-compose exec backend npm run db:migrate
```

Stop the stack with:

```bash
docker-compose down
```

---

## 13. Useful scripts

Backend:

```bash
cd backend
npm run dev
npm run build
npm run start
npm run db:migrate
npm run db:rollback
npm run db:seed
npm run test
npm run lint
```

Frontend:

```bash
cd frontend
npm run dev
npm run build
npm run preview
npm run lint
```

---

## 14. Troubleshooting

### Ollama is unreachable

Check:

```bash
ollama serve
ollama list
curl http://localhost:11434/api/tags
```

If using a remote Ollama host, confirm that:
- the service is reachable from the deployed environment
- the URL is correct
- no firewall or private-network restriction is blocking it

### Database connection fails

Check:

```bash
psql -U postgres -l
```

Then verify the values in `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=securechat_db
DB_USER=postgres
DB_PASSWORD=your_password
```

### Frontend cannot reach backend

Verify:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

If deployed, make sure those values point to the production backend domain.

### CORS errors

Confirm the backend allows your frontend domain in the CORS configuration and that `FRONTEND_URL` matches the real frontend origin.

### Migration errors

```bash
cd backend
npm run db:rollback
npm run db:migrate
```

---

## 15. Recommended production setup

For a real deployment, the recommended structure is:

- Frontend hosted on Vercel or Netlify
- Backend served via the platform runtime or a hosted Node service
- PostgreSQL hosted by a managed provider
- Ollama hosted on a machine or service that the backend can access
- JWT secret stored securely in the deployment environment

This is the correct production pattern for SecureChat.

---

## 16. Final note

This app is not meant to run without a real database and a working Ollama AI service. For local dev, use a local PostgreSQL instance and a local Ollama server. For production, use managed PostgreSQL and a hosted Ollama endpoint or a reachable internal Ollama service.

If you follow this guide exactly, the project is ready for proper deployment and day-to-day development.
