# Project: SecureChat

Cybersecurity awareness training platform with AI-powered learning, real-time chat, and gamification.

## Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS + Socket.IO
- **Backend**: Node.js + Express + TypeScript + Socket.IO
- **Database**: PostgreSQL + Knex.js
- **AI**: Ollama (local, required)
- **Auth**: JWT + bcryptjs
- **Deployment**: Vercel or Netlify

## Quick Setup (3 steps)

**Terminal 1 - Ollama:**
```bash
ollama serve
# Requires: ollama pull mistral
```

**Terminal 2 - Backend:**
```bash
cd backend && npm install
cp .env.example .env
npm run db:migrate
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd frontend && npm install
cp .env.example .env
npm run dev
```

Visit: http://localhost:3000

## Key Features
✅ AI-powered cybersecurity learning (Ollama)
✅ Real-time chat with Socket.IO
✅ Phishing simulation scenarios
✅ Gamification (points, badges, leaderboard)
✅ Employee engagement tracking
✅ Admin analytics dashboard
✅ Clean, modern UI with cyan/violet theme
✅ JWT authentication
✅ Serverless-compatible architecture

## Project Structure
```
SecureChat/
├── backend/          Node.js + Express API
├── frontend/         React + Vite
├── database/         PostgreSQL migrations
├── docs/             Documentation
├── vercel.json       Vercel deployment
└── netlify.toml      Netlify deployment
```

## API Endpoints
| Endpoint | Purpose |
|----------|---------|
| `POST /api/auth/register` | Create account |
| `POST /api/auth/login` | Sign in |
| `POST /api/chat/message` | Send message to AI |
| `GET /api/chat/:chatId` | Get conversation history |
| `GET /api/gamification/leaderboard` | View rankings |
| `GET /api/analytics/engagement` | Admin metrics |

## Environment Variables

**Backend** (backend/.env):
```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret_32_chars_min
FRONTEND_URL=http://localhost:3000
```

**Frontend** (frontend/.env):
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Documentation
- [RUN_GUIDE.md](RUN_GUIDE.md) - Local setup & deployment
- [README.md](README.md) - Feature overview
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - System design
- [docs/API.md](docs/API.md) - API reference
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) - Production deployment

## Deployment
- **Vercel**: Push to GitHub → Connect to Vercel → Set env vars → Deploy
- **Netlify**: Push to GitHub → Connect to Netlify → Set env vars → Deploy

See `vercel.json` or `netlify.toml` for configuration.

## Authentication
- No auto-login (must sign in manually)
- Password minimum 12 characters
- JWT tokens stored in localStorage
- Secure password hashing with bcryptjs

## Real-Time Features
- Socket.IO for live chat
- Automatic message delivery
- Connection status tracking
- Message history persistence

## Database
PostgreSQL with automatic migrations. Run `npm run db:migrate` to initialize.

## Support
See [RUN_GUIDE.md](RUN_GUIDE.md) for troubleshooting. Check documentation for detailed setup.
