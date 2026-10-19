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
OLLAMA_BASE_URL=http://ollama-host:11434
OLLAMA_MODEL=mistral
```

The deployed backend must be able to reach both MongoDB Atlas and the Ollama host. Add the backend's outbound IP to the Atlas network access list, or use an appropriate Atlas network policy.

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
