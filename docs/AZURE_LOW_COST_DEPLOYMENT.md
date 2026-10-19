# Azure Deployment

SecureChat can run as two Azure applications:

- Azure Static Web Apps for the React/Vite frontend
- Azure App Service for the Node.js/Express backend

MongoDB Atlas remains the managed database and the backend calls OpenRouter for AI responses. Docker and PostgreSQL are not part of this deployment.

## App Service settings

Set these values in App Service Configuration:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://abonyakatya_db_user:<db_password>@cluster0.0noe5mo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB_NAME=securechat_db
JWT_SECRET=<long-random-secret>
FRONTEND_URL=https://your-static-app.example
OPENAI_API_BASE=https://openrouter.ai/api/v1
OPENAI_API_KEY=<server-side-openrouter-key>
OPENAI_MODEL_NAME=meta-llama/llama-3.1-8b-instruct:free
X_OPENROUTER_TITLE=SecureChat Learning Platform
HTTP_REFERER=https://securechat.training
SYSTEM_PROMPT=<cybersecurity-only-system-prompt>
```

Allow the App Service outbound addresses in MongoDB Atlas Network Access. Keep all secrets server-side.

## Deployment

```powershell
cd backend
npm ci
npm run build
npm start
```

Build the frontend with `VITE_API_URL` pointing to the deployed backend. No database migration command is needed; indexes are initialized when the backend connects.
