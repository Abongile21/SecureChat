# SecureChat - AI-Powered Cybersecurity Awareness Chatbot

## 📋 Project Overview

SecureChat is an AI-powered chatbot designed to deliver cybersecurity awareness training with gamification elements. It combines intelligent chatbot conversations, phishing simulations, and employee engagement tracking in one platform.

## 🎯 Key Features

- **AI-Powered Conversations**: Leverages Ollama for local/self-hosted AI education
- **Phishing Simulations**: Create and deploy realistic phishing scenarios for employee training
- **Gamification**: Points, badges, and achievements to motivate continuous learning
- **Employee Engagement Tracking**: Real-time monitoring of training participation and progress
- **Manager Analytics**: Comprehensive reports for training effectiveness and ROI
- **Real-Time Chat**: Socket.IO integration for instant messaging
- **Interactive Training Modules**: Structured curriculum for systematic learning


## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Next-generation build tool
- **Tailwind CSS** - Utility-first styling
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **React Router** - Navigation
- **TanStack Query** - Server state management
- **Zustand** - State management

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB Atlas** - Document database
- **Ollama** - Local AI model (required)
- **Socket.IO** - Real-time messaging

### Database
- **MongoDB Atlas** - Primary datastore

### Authentication
- **JWT** - JSON Web Tokens

## 📁 Project Structure

```
SecureChat/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   └── middleware/
│   │   ├── services/
│   │   ├── models/
│   │   ├── config/
│   │   ├── utils/
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── styles/
│   │   ├── config/
│   │   └── App.tsx
│   ├── index.html
│   ├── package.json
│   └── .env.example
├── backend/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeds/
│   └── src/
├── frontend/
└── docs/
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- MongoDB Atlas account
- OpenRouter API for AI responses
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your Azure AD and API configuration
```

4. Start development server:
```bash
npm run dev
```

## 🔑 Configuration

### Backend Environment Variables

```env
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000

# Database
MONGODB_URI=mongodb+srv://abonyakatya_db_user:<db_password>@cluster0.0noe5mo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB_NAME=securechat_db

# OpenRouter (AI - Required)
OPENAI_API_BASE=https://openrouter.ai/api/v1
OPENAI_API_KEY=your_openrouter_api_key
OPENAI_MODEL_NAME=meta-llama/llama-3.1-8b-instruct:free
X_OPENROUTER_TITLE=SecureChat Learning Platform
HTTP_REFERER=https://securechat.training
SYSTEM_PROMPT=Your cybersecurity-only SecureChat system prompt

# JWT
JWT_SECRET=your_secret_minimum_32_characters
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=SecureChat
VITE_APP_VERSION=1.0.0
```

## 🤖 OpenRouter Setup (Required)

Create an OpenRouter API key and set `OPENAI_API_BASE`, `OPENAI_API_KEY`, and `OPENAI_MODEL_NAME` in `backend/.env`. The API key must remain server-side and must never be committed or exposed through frontend variables.

## 📊 Database Schema

### Core Tables
- **users** - Employee/admin accounts
- **chat_sessions** - Active chat conversations
- **chat_messages** - Message history and AI responses
- **badges** - Achievement definitions
- **user_badges** - Earned badges
- **points_ledger** - Points transaction history
- **phishing_simulations** - Phishing training data
- **training_modules** - Course content
- **user_training_progress** - Training completion tracking
- **engagement_logs** - Activity tracking

## 🎮 Gamification System

### Points
- Chat interaction: 5-20 points
- Training completion: 50-150 points
- Correct phishing identification: 25-50 points
- Badges unlock: 100+ points

### Badges
- **Security Novice**: First training completed
- **Phishing Expert**: 10 correct phishing identifications
- **Security Champion**: Top 10 leaderboard placement

## 🔐 Security

- Implement HTTPS only in production
- JWT token-based authentication
- Secure password hashing with bcrypt
- Input validation and sanitization
- Rate limiting on API endpoints
- SQL injection prevention with parameterized queries
- CORS configuration for trusted origins

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account (email, name, password)
- `POST /api/auth/login` - Sign in (email, password)
- `POST /api/auth/logout` - Sign out

### Chat
- `POST /api/chat/message` - Send message to AI
- `GET /api/chat/:chatId` - Get conversation history
- `POST /api/chat/start` - Start new chat session
- `GET /api/chat/sessions` - List user's chat sessions

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/leaderboard` - View all users (ranking)

### Gamification
- `GET /api/gamification/leaderboard` - Get leaderboard with rankings
- `GET /api/gamification/achievements/:userId` - Get user achievements
- `GET /api/gamification/badges` - Get available badges

### Analytics
- `GET /api/analytics/engagement` - User engagement metrics
- `GET /api/analytics/training-progress` - Training completion stats
- `GET /api/analytics/summary` - Admin dashboard summary

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test

# Linting
cd backend && npm run lint
cd frontend && npm run lint
```

## 📦 Deployment

SecureChat is serverless-compatible and deploys to **Vercel** or **Netlify**. Both platforms handle frontend and backend automatically.

### Prerequisites for Production
- MongoDB Atlas cluster
- OpenRouter API key
- Environment variables configured securely

### Vercel Deployment

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) and import repo
3. Set environment variables in dashboard:
   ```
   MONGODB_URI=mongodb+srv://abonyakatya_db_user:<db_password>@cluster0.0noe5mo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   OPENAI_API_BASE=https://openrouter.ai/api/v1
   OPENAI_API_KEY=your_openrouter_api_key
   OPENAI_MODEL_NAME=meta-llama/llama-3.1-8b-instruct:free
   X_OPENROUTER_TITLE=SecureChat Learning Platform
   HTTP_REFERER=https://securechat.training
   JWT_SECRET=generate-strong-random-secret-32-chars
   FRONTEND_URL=your-vercel-domain.vercel.app
   ```
4. Deploy automatically

See [vercel.json](vercel.json) for configuration.

### Netlify Deployment

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com) and import repo
3. Set environment variables in Site settings → Build & deploy
4. Deploy automatically

See [netlify.toml](netlify.toml) for configuration.

### Security Checklist
Before production:
- ✅ `JWT_SECRET` is strong (32+ characters)
- ✅ `MONGODB_URI` points to MongoDB Atlas (not a local database)
- ✅ OpenRouter API credentials are configured server-side
- ✅ Environment variables set in deployment dashboard (not in code)
- ✅ `NODE_ENV=production`
- ✅ HTTPS enforced
- ✅ Database backups configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📚 More Documentation

- [RUN_GUIDE.md](RUN_GUIDE.md) - Local setup and deployment guide
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - System architecture
- [docs/API.md](docs/API.md) - Detailed API documentation
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) - Production deployment guide
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines

## 🆘 Support

For support, email support@securechat.com or open an issue on GitHub.
