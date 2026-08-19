# SecureChat Run Guide

This guide covers how to run the frontend and backend locally, how to connect the database under the backend, and how to prepare the app for Azure deployment.

## 1. Project structure

- Frontend: frontend/
- Backend: backend/
- Database files: backend/database/

## 2. Prerequisites

- Node.js 18+
- npm
- PostgreSQL 12+
- Optional: Docker Desktop
- Optional: Azure account for Entra ID auth
- Optional: OpenAI API key for AI chat features

## 3. Backend setup

### 3.1 Install dependencies

```bash
cd backend
npm install
```

### 3.2 Create environment file

Create a .env file inside the backend folder:

```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=securechat_db
DB_USER=postgres
DB_PASSWORD=your_password
OPENAI_API_KEY=your_openai_key
AZURE_AD_TENANT_ID=your_tenant_id
AZURE_AD_CLIENT_ID=your_client_id
AZURE_AD_CLIENT_SECRET=your_client_secret
JWT_SECRET=your_secure_secret
FRONTEND_URL=http://localhost:3000
```

### 3.3 Start PostgreSQL

If PostgreSQL is not running locally, start it and create the database:

```sql
c;
```

### 3.4 Run migrations and seeds

```bash
cd backend
npm run db:migrate
npm run db:seed
```

### 3.5 Start the backend

```bash
cd backend
npm run dev
```

The backend should be available at:

- http://localhost:5000/health
- http://localhost:5000/api

## 4. Frontend setup

### 4.1 Install dependencies

```bash
cd frontend
npm install
```

### 4.2 Create environment file

Create a .env file inside the frontend folder:

```env
VITE_API_URL=http://localhost:5000/api
VITE_AZURE_CLIENT_ID=your_client_id
VITE_AZURE_TENANT_ID=your_tenant_id
VITE_REDIRECT_URI=http://localhost:3000
```

### 4.3 Start the frontend

```bash
cd frontend
npm run dev
```

The frontend should be available at:

- http://localhost:3000

## 5. Run everything together

Open two terminals:

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

## 6. Docker option

### Start with Docker Compose

```bash
docker-compose up --build
```

### Useful Docker commands

```bash
docker-compose up -d
docker-compose logs -f
docker-compose down
docker-compose exec backend npm run db:migrate
docker-compose exec backend npm run db:seed
```

## 7. Azure setup

For the complete low-cost Azure plan, resource settings, GitHub Actions secrets, migration order, and budget alerts, use [docs/AZURE_LOW_COST_DEPLOYMENT.md](docs/AZURE_LOW_COST_DEPLOYMENT.md).

### 7.1 Create an Entra ID app registration

1. Open Azure Portal
2. Go to Microsoft Entra ID
3. Open App registrations
4. Create a new app named SecureChat
5. Add a redirect URI:
   - http://localhost:3000
   - or your deployed frontend URL
6. Copy the Application (client) ID and Directory (tenant) ID
7. Create a client secret if needed

### 7.2 Configure Azure values

Use these values in the backend and frontend .env files:

```env
AZURE_AD_TENANT_ID=<tenant-id>
AZURE_AD_CLIENT_ID=<client-id>
AZURE_AD_CLIENT_SECRET=<client-secret>
```

```env
VITE_AZURE_CLIENT_ID=<client-id>
VITE_AZURE_TENANT_ID=<tenant-id>
VITE_REDIRECT_URI=http://localhost:3000
```

### 7.3 Azure deployment options

- Frontend: Azure Static Web Apps or Azure App Service
- Backend: Azure App Service or Azure Container Apps
- Database: Azure Database for PostgreSQL
- Secrets: Azure App Service Configuration or Azure Key Vault

## 8. Troubleshooting

### Port already in use

If port 5000 or 3000 is busy:

```bash
# Windows
netstat -ano | findstr :5000
# or stop the conflicting process
```

### Backend cannot reach database

- Check DB_HOST, DB_PORT, DB_NAME, DB_USER, and DB_PASSWORD
- Ensure PostgreSQL is running
- Ensure the database exists

### Azure login fails

- Verify the redirect URI matches exactly
- Check that the app is allowed for the correct tenant
- Confirm the client secret is valid

## 9. Recommended production checklist

- Use strong secrets in environment variables
- Enable HTTPS only
- Store secrets in Azure Key Vault or App Service settings
- Use managed PostgreSQL in Azure
- Set CORS properly for the deployed frontend domain
