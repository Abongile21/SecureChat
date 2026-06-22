# SecureChat - AI-Powered Cybersecurity Awareness Chatbot

## 📋 Project Overview

SecureChat is an AI-powered chatbot designed to deliver cybersecurity awareness training with gamification elements. It combines intelligent chatbot conversations, phishing simulations, and employee engagement tracking in one platform.

## 🎯 Key Features

- **AI-Powered Conversations**: Leverages OpenAI to deliver engaging cybersecurity education
- **Phishing Simulations**: Create and deploy realistic phishing scenarios for employee training
- **Gamification**: Points, badges, and achievements to motivate continuous learning
- **Employee Engagement Tracking**: Real-time monitoring of training participation and progress
- **Manager Analytics**: Comprehensive reports for training effectiveness and ROI
- **Microsoft Entra ID Integration**: Enterprise-grade authentication with Azure AD
- **Interactive Training Modules**: Structured curriculum for systematic learning

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Next-generation build tool
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **React Router** - Navigation
- **MSAL** - Microsoft authentication
- **TanStack Query** - Server state management

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Relational database
- **Knex.js** - Query builder and migrations
- **OpenAI API** - AI conversations
- **Passport.js** - Authentication

### Database & Analytics
- **PostgreSQL** - Primary datastore
- **Power BI** - Advanced analytics and reporting

### Authentication
- **Microsoft Entra ID (Azure AD)** - Enterprise SSO

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
├── database/
│   ├── migrations/
│   └── seeds/
└── docs/
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL >= 12
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

4. Run database migrations:
```bash
npm run db:migrate
```

5. Seed initial data:
```bash
npm run db:seed
```

6. Start development server:
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
DB_HOST=localhost
DB_PORT=5432
DB_NAME=securechat_db
DB_USER=postgres
DB_PASSWORD=your_password

# Azure AD
AZURE_AD_TENANT_ID=your_tenant_id
AZURE_AD_CLIENT_ID=your_client_id
AZURE_AD_CLIENT_SECRET=your_client_secret

# OpenAI
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-4

# JWT
JWT_SECRET=your_secret
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
REACT_APP_AZURE_CLIENT_ID=your_client_id
REACT_APP_AZURE_TENANT_ID=your_tenant_id
REACT_APP_REDIRECT_URI=http://localhost:3000
```

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
- `POST /api/auth/login` - Login with Azure AD
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh-token` - Refresh JWT token

### Chat
- `POST /api/chat/message` - Send message to chatbot
- `GET /api/chat/history/:chatId` - Get chat history
- `POST /api/chat/start` - Start new chat session

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - List all users (admin only)

### Gamification
- `GET /api/gamification/leaderboard` - Get leaderboard
- `GET /api/gamification/achievements/:userId` - Get user achievements
- `POST /api/gamification/points` - Award points
- `GET /api/gamification/badges` - Get available badges

### Analytics
- `GET /api/analytics/engagement` - Engagement metrics
- `GET /api/analytics/training-progress` - Training stats
- `POST /api/analytics/generate-report` - Generate report
- `GET /api/analytics/phishing-stats` - Phishing simulation stats

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

## 📦 Deployment

### Backend Deployment (Node.js hosting, AWS/Azure/Heroku)
```bash
npm run build
npm start
```

### Frontend Deployment (Static hosting, Netlify/Vercel)
```bash
npm run build
# Deploy dist/ directory
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@securechat.com or open an issue on GitHub.

## 📞 Contact

- **Email**: info@securechat.com
- **Website**: https://securechat.com
- **Documentation**: https://docs.securechat.com
