# Azure and local setup guide

## 1. What you need

- An Azure account with access to Microsoft Entra ID
- A registered app in Entra ID for SecureChat
- A tenant ID and client ID for that app
- Optional: a PostgreSQL instance and an OpenAI API key if you want the full experience

## 2. Create the Entra app

1. Sign in to the Azure portal.
2. Open Microsoft Entra ID.
3. Go to App registrations > New registration.
4. Name the app SecureChat.
5. Choose a supported account type.
6. Set the redirect URI to:
   - http://localhost:3000 for the frontend demo flow
   - or your deployed frontend URL in production
7. Save the app and copy the Application (client) ID.
8. Copy the Directory (tenant) ID.

## 3. Configure the frontend

Create a frontend .env file from the example:

```bash
cd frontend
copy .env.example .env
```

Set these values:

```env
VITE_API_URL=http://localhost:5000/api
VITE_AZURE_CLIENT_ID=<your-client-id>
VITE_AZURE_TENANT_ID=<your-tenant-id>
VITE_REDIRECT_URI=http://localhost:3000
```

## 4. Configure the backend

Create a backend .env file:

```bash
cd backend
copy .env.example .env
```

Set the Azure values and other basics:

```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=securechat_db
DB_USER=postgres
DB_PASSWORD=your_password
AZURE_AD_TENANT_ID=<your-tenant-id>
AZURE_AD_CLIENT_ID=<your-client-id>
AZURE_AD_CLIENT_SECRET=<your-client-secret>
OPENAI_API_KEY=<your-openai-key>
JWT_SECRET=replace-with-a-secure-secret
FRONTEND_URL=http://localhost:3000
```

## 5. Run locally

### Backend

```bash
cd backend
npm install
npm run build
npm run dev
```

### Frontend
cd frontend
npm install
npm run dev

## 6. Common Azure account tips

- Use a test tenant if you do not want to expose the app to all users.
- Add yourself as a user in the tenant before testing sign-in.
- If sign-in fails, verify the redirect URI matches exactly.
- If you see a consent prompt, grant the requested permissions.
- For production, use a secret or certificate stored securely in Azure.

## 7. Recommended next steps

- Add real Microsoft Graph scopes if you want profile data beyond the demo login.
- Move the backend auth to a production-grade Entra token validation flow.
- Deploy the frontend to Azure Static Web Apps or App Service.
- Deploy the backend to Azure App Service or Azure Container Apps.
