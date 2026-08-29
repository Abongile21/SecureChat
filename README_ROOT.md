# SecureChat - Root Configuration

Cybersecurity awareness training platform with AI-powered learning, real-time chat, and gamification.

## Structure

- **backend/** - Node.js/Express API server with Socket.IO
- **frontend/** - React + Vite web application
- **database/** - PostgreSQL migrations and seeds
- **docs/** - Project documentation
- **vercel.json** - Vercel deployment configuration
- **netlify.toml** - Netlify deployment configuration

## Requirements

- **Node.js** >= 18.0.0
- **npm** or yarn
- **PostgreSQL** >= 12
- **Ollama** (required for AI features)

## Quick Start

1. **Install Ollama:** Download from [ollama.ai](https://ollama.ai) and run `ollama pull mistral`
2. **Backend:** `cd backend && npm install && npm run db:migrate && npm run dev`
3. **Frontend:** `cd frontend && npm install && npm run dev`
4. **Access:** http://localhost:3000

See [RUN_GUIDE.md](RUN_GUIDE.md) for detailed setup instructions.

## Key Commands

### Backend
```bash
cd backend
npm install
npm run dev              # Start development server
npm run build            # Compile TypeScript
npm run db:migrate       # Apply migrations
npm run db:seed          # Seed data (optional)
npm test                 # Run tests
npm run lint             # Check code style
```

### Frontend
```bash
cd frontend
npm install
npm run dev              # Start dev server (port 3000)
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Check code style
```

## Environment Setup

1. Copy `.env.example` files to `.env`:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
2. Update `.env` files with your configuration
3. Ensure PostgreSQL is running
4. Ensure Ollama is running: `ollama serve`

## Documentation

| File | Purpose |
|------|---------|
| [README.md](README.md) | Project overview & features |
| [RUN_GUIDE.md](RUN_GUIDE.md) | Local setup & deployment |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design |
| [docs/API.md](docs/API.md) | API endpoints |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Production deployment |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |

## Deployment

**Vercel:** Push to GitHub, connect to Vercel, set environment variables.  
**Netlify:** Push to GitHub, connect to Netlify, set environment variables.

See [vercel.json](vercel.json) or [netlify.toml](netlify.toml) for configuration details.

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js + TypeScript |
| Database | PostgreSQL with Knex.js migrations |
| Real-time | Socket.IO |
| AI | Ollama (local) |
| Auth | JWT + bcryptjs |

## More Information

For detailed setup, deployment, or development instructions, see [RUN_GUIDE.md](RUN_GUIDE.md).
