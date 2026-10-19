# SecureChat Run Guide

SecureChat runs without Docker using four services:

- MongoDB Atlas for persistence
- Ollama locally for AI responses
- Node.js/Express backend
- React/Vite frontend

## Requirements

- Node.js 18+
- npm
- MongoDB Atlas cluster and database user
- Ollama

## Configure the backend

Copy `backend/.env.example` to `backend/.env` and set:

```env
MONGODB_URI=mongodb+srv://abonyakatya_db_user:<db_password>@cluster0.0noe5mo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB_NAME=securechat_db
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:3000
```

URL-encode special characters in the MongoDB password. Keep `.env` private.

## Start services

```powershell
# Terminal 1
ollama serve
ollama pull mistral

# Terminal 2
cd backend
npm install
npm run dev

# Terminal 3
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`. The API is available at `http://localhost:5000`.

The backend uses one shared MongoDB client and creates its indexes automatically. No PostgreSQL, Knex migrations, Docker, or local database process is required.
