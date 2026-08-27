# Project: SecureChat

## Overview
AI-powered cybersecurity awareness chatbot with gamification, employee engagement tracking, and manager analytics.

## Tech Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **AI**: OpenAI API
- **Auth**: Microsoft Entra ID (Azure AD)
- **Analytics**: Power BI

## Getting Started

### Quick Setup

1. **Clone & Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```

2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

3. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health: http://localhost:5000/health

## Key Features
✅ AI-powered cybersecurity conversations
✅ Phishing simulation scenarios
✅ Gamification system (points, badges)
✅ Employee engagement tracking
✅ Manager analytics & reporting
✅ Azure AD integration
✅ Training module management

## Project Structure
```
SecureChat/
├── backend/          (Node.js API)
├── frontend/         (React app)
├── database/         (Migrations & seeds)
└── docs/            (Documentation)
```

## Documentation
- [Architecture](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Low-cost Azure deployment for a four-month trial](docs/AZURE_LOW_COST_DEPLOYMENT.md)

## Key Endpoints
- `POST /api/auth/login` - Authentication
- `POST /api/chat/message` - Send chat message
- `GET /api/gamification/leaderboard` - Leaderboard
- `GET /api/analytics/engagement` - Metrics (admin)

## Environment Setup
See `.env.example` files in both backend and frontend directories.

## Database
PostgreSQL with Knex.js migrations. Run `npm run db:migrate` to setup.

## Support
For issues or questions, refer to documentation or create a GitHub issue.
