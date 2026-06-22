# SecureChat - Root Configuration

This is the root directory for the SecureChat project.

## Structure

- **backend/** - Node.js/Express API server
- **frontend/** - React web application
- **database/** - Database migrations and seeds
- **docs/** - Project documentation

## Quick Commands

### Backend
```bash
cd backend
npm install
npm run dev              # Start development server
npm run build            # Build TypeScript
npm test                 # Run tests
npm run db:migrate       # Run database migrations
```

### Frontend
```bash
cd frontend
npm install
npm run dev              # Start development server
npm run build            # Build for production
npm test                 # Run tests
```

## Documentation

- [README.md](README.md) - Project overview
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Quick reference
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - System architecture
- [docs/API.md](docs/API.md) - API documentation
- [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) - Development guide
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) - Deployment guide

## Requirements

- Node.js >= 18.0.0
- PostgreSQL >= 12
- npm or yarn

## First Time Setup

1. Setup backend: `cd backend && npm install && npm run db:migrate`
2. Setup frontend: `cd frontend && npm install`
3. Configure environment variables (see .env.example files)
4. Start both servers in separate terminals

## More Information

See individual README files in backend/ and frontend/ directories for specific setup instructions.
