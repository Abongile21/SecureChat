# SecureChat Run Guide

Complete guide to running SecureChat locally and deploying to production.

---

## Prerequisites

- **Node.js** 18 or higher
- **npm** (comes with Node.js)
- **PostgreSQL** 12 or higher
- **Ollama** (for local AI features)
- **Git**

---

## Part 1: Local Development Setup

### Step 1: Clone & Install Dependencies

```bash
# Navigate to project directory
cd SecureChat

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Set Up Ollama (Required)

Ollama provides local AI capabilities without external API keys.

**Install Ollama:**
1. Download from [ollama.ai](https://ollama.ai)
2. Run the installer

**Pull a Model:**
```bash
# Pull the default model (Mistral)
ollama pull mistral

# Or try another model:
ollama pull neural-chat
ollama pull dolphin-mixtral
```

**Start Ollama Service:**
```bash
# In a terminal, start Ollama (runs on port 11434)
ollama serve
```

Keep this terminal open. Verify it's working:
```bash
curl http://localhost:11434/api/tags
```

### Step 3: Set Up PostgreSQL Database

**Create the database:**

On Windows (PowerShell):
```powershell
# Connect to PostgreSQL
psql -U postgres

# In psql:
CREATE DATABASE securechat_db;
\q
```

On macOS/Linux:
```bash
createdb securechat_db
```

### Step 4: Configure Backend Environment

Create `backend/.env`:

```env
# Server
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=securechat_db
DB_USER=postgres
DB_PASSWORD=your_password

# Ollama (Required)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral

# JWT Authentication
JWT_SECRET=your_secret_key_minimum_32_characters_long
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Step 5: Configure Frontend Environment

Create `frontend/.env`:

```env
# Backend API
VITE_API_URL=http://localhost:5000/api

# Real-time Socket.IO
VITE_SOCKET_URL=http://localhost:5000

# App Settings
VITE_APP_NAME=SecureChat
VITE_APP_VERSION=1.0.0
```

### Step 6: Initialize Database

Run migrations and seed data:

```bash
cd backend

# Run database migrations
npm run db:migrate

# Optional: Seed initial data
npm run db:seed

cd ..
```

---

## Part 2: Running Locally

Open **3 terminals**:

**Terminal 1 - Ollama:**
```bash
ollama serve
# Runs on http://localhost:11434
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

**Access the app:**
- Frontend: http://localhost:3000
- API: http://localhost:5000/api
- Health check: http://localhost:5000/health

---

## Part 3: Authentication

**Create Account:**
1. Go to http://localhost:3000
2. Click "Register"
3. Enter name, email, and password (minimum 12 characters)
4. Click "Create Account"

**Sign In:**
1. Enter email and password
2. Click "Sign In"

---

## Part 4: Production Deployment

### Option A: Vercel

**Prerequisites:**
- GitHub repository
- PostgreSQL database (Supabase, Railway, AWS RDS)
- Ollama instance (local or cloud)

**Steps:**
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set environment variables:
   ```
   DATABASE_URL: your-postgres-url
   OLLAMA_BASE_URL: your-ollama-url
   OLLAMA_MODEL: mistral
   JWT_SECRET: strong-random-secret
   FRONTEND_URL: your-vercel-domain.vercel.app
   ```
5. Deploy

**Configuration:** See `vercel.json`

### Option B: Netlify

**Prerequisites:**
- GitHub repository
- PostgreSQL database (Supabase, Railway, AWS RDS)
- Ollama instance (local or cloud)

**Steps:**
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import your repository
4. Netlify detects `netlify.toml`
5. Set environment variables in Netlify dashboard
6. Deploy

**Configuration:** See `netlify.toml`

### Environment Variables for Production

```env
# Database (use managed PostgreSQL)
DATABASE_URL=postgresql://user:pass@host/securechat_db

# Ollama (self-hosted or cloud)
OLLAMA_BASE_URL=https://your-ollama-instance.com
OLLAMA_MODEL=mistral

# Security
NODE_ENV=production
JWT_SECRET=generate-a-strong-random-secret-32-chars-min
JWT_EXPIRE=7d

# Deployment
FRONTEND_URL=https://your-domain.com
```

**Never commit secrets to Git.** Use:
- Vercel: Environment Variables dashboard
- Netlify: Site settings → Build & deploy → Environment
- Or use `.env.local` (ignored by git)

---

## Docker Option (Optional)

Build and run with Docker:

```bash
# Build images
docker-compose build

# Start services
docker-compose up

# Run migrations
docker-compose exec backend npm run db:migrate

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

---

## Troubleshooting

### Port Already in Use

**Windows:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill it
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# Find and kill
lsof -i :5000
kill -9 <PID>
```

### Ollama Connection Error

```
Error: Cannot reach http://localhost:11434
```

**Solution:**
1. Check if Ollama is running: `ollama serve`
2. Check if model is pulled: `ollama list`
3. Verify `OLLAMA_BASE_URL` in `.env`

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
1. Ensure PostgreSQL is running
2. Check `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
3. Verify database exists: `psql -U postgres -l`

### Frontend Cannot Reach Backend

```
Error: Failed to fetch /api/auth/login
```

**Solution:**
1. Check `VITE_API_URL` in `frontend/.env`
2. Ensure backend is running on correct port
3. Check CORS settings in `backend/src/index.ts`

### Migration Errors

```bash
# Reset migrations (DEV ONLY)
npm run db:rollback

# Run again
npm run db:migrate
```

---

## Development Scripts

**Backend:**
```bash
npm run dev          # Start dev server with auto-reload
npm run build        # Compile TypeScript
npm run start        # Run compiled code
npm run db:migrate   # Run pending migrations
npm run db:rollback  # Rollback last migration
npm run db:seed      # Seed initial data
npm run test         # Run tests
npm run lint         # Check code style
```

**Frontend:**
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code style
```

---

## Next Steps

- Read [README.md](README.md) for feature overview
- Check [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for advanced deployment
- Review [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for system design
- See [docs/API.md](docs/API.md) for API documentation

---

## Support

For issues or questions:
1. Check this guide's Troubleshooting section
2. Review `backend/.env.example` and `frontend/.env.example`
3. Check application logs: `backend/error.log` and `backend/combined.log`
