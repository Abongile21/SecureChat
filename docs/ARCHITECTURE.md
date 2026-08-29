# SecureChat Architecture

## System Overview

```
┌────────────────────────────────────────────────────────────┐
│              Frontend (React + Vite)                       │
│  ┌──────────────┐  ┌──────────┐  ┌──────────────────┐    │
│  │  React App   │──│  Router  │──│  Auth Context    │    │
│  └──────────────┘  └──────────┘  └──────────────────┘    │
│  ┌─────────────────────────────────────────────────┐     │
│  │  Socket.IO Client (real-time messages)          │     │
│  └─────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────┘
               │ HTTPS/WSS
┌──────────────────────────────────────────────────────────┐
│          Backend (Node.js + Express)                     │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Express Server + Socket.IO Server              │    │
│  ├─────────────────────────────────────────────────┤    │
│  │  Auth Middleware  │  Error Handler  │  Logging  │    │
│  ├─────────────────────────────────────────────────┤    │
│  │  Auth Routes  │  Chat Routes  │  Gamif Routes  │    │
│  └─────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────┐    │
│  │  AI Service (Ollama) │ Gamification │ Analytics │    │
│  └─────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
          │              │              │
    ┌─────▼─────┐  ┌────▼─────┐  ┌───▼──────┐
    │ PostgreSQL│  │  Ollama   │  │  Logger  │
    │ Database  │  │  (Local)  │  │  (File)  │
    └───────────┘  └──────────┘  └──────────┘
```

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Real-time | Socket.IO 4.7.2 |
| Backend | Node.js + Express.js + TypeScript |
| Database | PostgreSQL + Knex.js |
| AI/ML | Ollama (local HTTP API) |
| Authentication | JWT + bcryptjs |
| Logging | Winston |

## Component Architecture

### Frontend

**Pages:**
- **Login** - Registration and sign-in (no auto-login)
- **Chat** - AI conversation interface with real-time messaging
- **Dashboard** - User overview and quick stats
- **Leaderboard** - Gamification rankings and badges
- **Analytics** - Admin engagement metrics
- **Settings** - User preferences

**Services:**
- `apiClient` - Axios instance for HTTP requests
- `chatService` - Chat API operations
- `AuthContext` - Authentication state (JWT tokens in localStorage)

**Real-time:**
- Socket.IO Client connects to backend on page load
- Emits: `join-chat`, `message`
- Receives: `message-received`, connection events

### Backend

**API Routes:**
- `/api/auth` - Register, login, logout
- `/api/chat` - Send messages, get history
- `/api/gamification` - Leaderboard, points, badges
- `/api/analytics` - Engagement metrics (admin)
- `/api/users` - User profile, settings
- `/health` - Server health check

**Services:**
1. **AI Service** (`aiService.ts`)
   - Calls Ollama HTTP API: `POST http://localhost:11434/api/chat`
   - Sends conversation context and system prompts
   - Analyzes phishing attempts
   - Returns text responses

2. **Authentication Service** (authController.ts)
   - JWT generation and validation
   - Password hashing (bcryptjs)
   - User registration and login
   - Token stored in localStorage (frontend)

3. **Gamification Service** (gamificationController.ts)
   - Points calculation and storage
   - Badge assignment logic
   - Leaderboard ranking
   - Achievement tracking

4. **Analytics Service** (analyticsController.ts)
   - Engagement metrics aggregation
   - Training progress tracking
   - User activity logging

5. **Socket.IO Server**
   - Namespace: `/` (default)
   - Events:
     - `connection` - New client connects
     - `disconnect` - Client disconnects
     - `join-chat` - User joins chat room
     - `message` - Broadcast new message to room
     - `message-received` - Confirmation delivery

## Authentication Flow

```
1. User Registration
   POST /api/auth/register
   ├─ Validate input
   ├─ Hash password (bcryptjs)
   ├─ Create user in DB
   └─ Return JWT token + user data

2. User Login
   POST /api/auth/login
   ├─ Find user by email
   ├─ Verify password hash
   ├─ Generate JWT token
   └─ Return token + user data

3. Protected Routes
   GET /api/protected-route
   ├─ Extract token from Authorization header
   ├─ Verify JWT signature
   ├─ Attach user to request
   └─ Proceed with request

4. Token Storage
   ├─ Frontend: localStorage.setItem('token', jwt)
   ├─ Sent: Authorization: Bearer <token>
   └─ Cleared on logout
```

## Chat & Real-time Flow

```
User sends message
    │
    ▼
Socket.IO emits: { event: 'message', data: { text, userId, chatId } }
    │
    ▼
Backend receives message event
    ├─ Validate user session
    ├─ Store message in DB
    └─ Call AI Service
         │
         ▼
    Ollama API (HTTP POST)
    ├─ System prompt: "You are a cybersecurity expert..."
    ├─ Send conversation history
    ├─ Get AI response
    └─ Return bot message
         │
         ▼
    Award gamification points
    ├─ Add points to user
    ├─ Check badge conditions
    └─ Update leaderboard
         │
         ▼
    Emit Socket.IO: { event: 'message-received', data: { botMessage, points } }
         │
         ▼
Frontend receives and displays
├─ Show AI response
├─ Update user points
├─ Play notification
└─ Update leaderboard
```

## Database Schema

**Core Tables:**
- `users` - id, email, name, password_hash, role, total_points, current_rank
- `chat_sessions` - id, user_id, title, created_at
- `chat_messages` - id, session_id, user_id, content, role, created_at
- `badges` - id, name, description, icon_url
- `user_badges` - id, user_id, badge_id, earned_at
- `points_ledger` - id, user_id, points, action, created_at
- `engagement_logs` - id, user_id, action, metadata, created_at

See [API.md](API.md) for full schema details.

## Security Architecture

**Authentication:**
- No auto-login (manual sign-in required)
- Password minimum 12 characters
- Passwords hashed with bcryptjs (salt rounds: 10)
- JWT tokens: 7-day expiry
- Tokens in localStorage (HTTP-only not supported client-side, secure in production)

**Authorization:**
- Role-based access control: user, admin
- Middleware validates JWT on protected routes
- Chat messages verified to belong to authenticated user

**API Security:**
- CORS policy: Restricted to frontend domain
- Helmet.js: Security headers (CSP, X-Frame-Options, etc.)
- Input validation on all endpoints
- Error responses hide sensitive information
- Logging (Winston): All requests and errors

**Data Protection:**
- Database password stored in environment
- Ollama endpoint URL configurable
- JWT secret strong (32+ characters minimum)
- HTTPS enforced in production

## Scalability

**Horizontal Scaling:**
- Stateless API (Session data in JWT only)
- PostgreSQL connection pooling (Knex.js default)
- Load balancer compatible
- Each backend instance independent

**Caching:**
- Frontend: TanStack Query caching
- Browser: localStorage for tokens
- Leaderboard: Could add Redis cache (optional)

**Database Optimization:**
- Indexed queries on user_id, email
- Connection pool max: configurable (default 10)
- Migrations managed via Knex.js

**Ollama Optimization:**
- Local HTTP calls (no network latency in dev)
- Model timeout: 60s (configurable)
- Fallback responses if Ollama unavailable

## Deployment Architecture

**Vercel (Frontend + Serverless Backend):**
- Frontend: Static React build (dist/) served by Vercel CDN
- Backend: Serverless functions in netlify/functions
- Database: Managed PostgreSQL (Supabase/Railway)
- Ollama: Self-hosted or cloud endpoint

**Netlify (Frontend + Serverless Backend):**
- Frontend: Static React build served by Netlify CDN
- Backend: Functions in netlify/functions/ directory
- Database: Managed PostgreSQL (Supabase/Railway)
- Ollama: Self-hosted or cloud endpoint

**Local Development:**
- 3 terminals: Ollama, Backend (port 5000), Frontend (port 3000)
- Direct API calls via HTTP
- Socket.IO WebSocket connections

## Environment Variables

**Backend:**
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://...
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral
JWT_SECRET=strong-32-char-minimum
JWT_EXPIRE=7d
FRONTEND_URL=https://domain.com
LOG_LEVEL=info
```

**Frontend:**
```env
VITE_API_URL=https://api.domain.com/api
VITE_SOCKET_URL=https://api.domain.com
VITE_APP_NAME=SecureChat
VITE_APP_VERSION=1.0.0
```

## Performance Targets

| Metric | Target |
|--------|--------|
| Auth Response | < 200ms |
| Chat Response | < 5s (Ollama inference) |
| API Response (avg) | < 200ms |
| Page Load | < 2s |
| WebSocket Latency | < 100ms |

## Monitoring

**Logging (Winston):**
- Level: info, warn, error
- Format: JSON
- Files: combined.log, error.log (backend/)

**Health Check:**
- `GET /health` - Server status
- Returns: { status: 'ok', timestamp, uptime }

**Metrics to Track:**
- API response times
- Ollama response times
- Database query times
- Error rates by endpoint
- Active Socket.IO connections
- User engagement
