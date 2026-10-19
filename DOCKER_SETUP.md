# Local Development Setup

Docker is not required or used by SecureChat.

## Services

Run these services directly:

1. **MongoDB Atlas** - the remote database configured by `MONGODB_URI`.
2. **Ollama** - the local AI service at `http://localhost:11434`.
3. **Backend** - the Express API at `http://localhost:5000`.
4. **Frontend** - the Vite application at `http://localhost:3000`.

## Start the application

Configure `backend/.env` from `backend/.env.example`, replacing `<db_password>` with the MongoDB Atlas database password. Do not commit the completed URI.

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

The backend creates the required MongoDB indexes automatically. There are no PostgreSQL migrations, seed commands, Docker containers, or local database services.
