# Deployment Guide

Deploy the frontend and backend as separate Node.js applications. Docker is not required.

## Backend environment

Configure these server-side variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://abonyakatya_db_user:<db_password>@cluster0.0noe5mo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB_NAME=securechat_db
JWT_SECRET=<long-random-secret>
FRONTEND_URL=https://your-frontend.example
OPENAI_API_BASE=https://openrouter.ai/api/v1
OPENAI_API_KEY=<server-side-openrouter-key>
OPENAI_MODEL_NAME=meta-llama/llama-3.1-8b-instruct:free
X_OPENROUTER_TITLE=SecureChat Learning Platform
HTTP_REFERER=https://securechat.training
SYSTEM_PROMPT=<cybersecurity-only-system-prompt>
```

The deployed backend must be able to reach both MongoDB Atlas and the Ollama host. Add the backend's outbound IP to the Atlas network access list, or use an appropriate Atlas network policy.

## Demo login

If the MongoDB database is empty, create a demo user before signing in:

```powershell
cd backend
npm run seed:demo
```

The default demo credentials are:

```text
Email:    demo@securechat.local
Password: SecureChatDemo2026!
```

The command is safe to run repeatedly; it does not overwrite an existing user.
Set `DEMO_USER_EMAIL`, `DEMO_USER_PASSWORD`, and `DEMO_USER_NAME` in `backend/.env`
before running the command if you need different credentials. The demo password must
be at least 12 characters long.

## Commands

```powershell
cd backend
npm ci
npm run build
npm start
```

Build and deploy the frontend separately with its API URL:

```env
VITE_API_URL=https://your-backend.example/api
```

MongoDB Atlas indexes are created automatically on backend startup. There are no PostgreSQL migration steps.
