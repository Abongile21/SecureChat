# Azure Deployment

SecureChat can run as two Azure applications:

- Azure Static Web Apps for the React/Vite frontend
- Azure App Service for the Node.js/Express backend

MongoDB Atlas remains the managed database and Ollama must be hosted at a reachable endpoint. Docker and PostgreSQL are not part of this deployment.

## App Service settings

Set these values in App Service Configuration:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://abonyakatya_db_user:<db_password>@cluster0.0noe5mo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB_NAME=securechat_db
JWT_SECRET=<long-random-secret>
FRONTEND_URL=https://your-static-app.example
OLLAMA_BASE_URL=https://your-ollama-endpoint.example
OLLAMA_MODEL=mistral
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
