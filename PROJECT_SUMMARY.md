# Project: SecureChat

Cybersecurity awareness training platform with AI-powered learning, real-time chat, and gamification.

## Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS + Socket.IO
- **Backend**: Node.js + Express + TypeScript + Socket.IO
- **Database**: MongoDB Atlas with the official MongoDB Node.js driver
- **AI**: OpenRouter API with `meta-llama/llama-3.1-8b-instruct:free`
- **Auth**: JWT + bcryptjs
- **Deployment**: Vercel or Netlify

## Quick Setup (3 steps)

**Terminal 1 - Backend:**
```bash
cd backend && npm install
cp .env.example .env
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend && npm install
cp .env.example .env
npm run dev
```

Visit: http://localhost:3000

## Key Features
✅ AI-powered cybersecurity learning (OpenRouter)
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
OPENAI_API_BASE=https://openrouter.ai/api/v1
OPENAI_API_KEY=your_openrouter_api_key
OPENAI_MODEL_NAME=meta-llama/llama-3.1-8b-instruct:free
X_OPENROUTER_TITLE=SecureChat Learning Platform
HTTP_REFERER=https://securechat.training
SYSTEM_PROMPT=Your cybersecurity-only SecureChat system prompt
MONGODB_URI=mongodb+srv://abonyakatya_db_user:<db_password>@cluster0.0noe5mo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
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
MongoDB Atlas with indexes created automatically when the backend connects.

## Support
See [RUN_GUIDE.md](RUN_GUIDE.md) for troubleshooting. Check documentation for detailed setup.
