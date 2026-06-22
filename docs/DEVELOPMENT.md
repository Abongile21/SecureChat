# Development Guide

## Getting Started with Development

### 1. Prerequisites Setup

Ensure you have the following installed:
- Node.js v18+ ([download](https://nodejs.org))
- PostgreSQL 12+ ([download](https://www.postgresql.org/download))
- Git
- VS Code (recommended)

### 2. Clone the Repository

```bash
git clone https://github.com/your-org/securechat.git
cd SecureChat
```

### 3. Environment Configuration

#### Backend Setup

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=securechat_db
DB_USER=postgres
DB_PASSWORD=your_password

OPENAI_API_KEY=your_openai_key

AZURE_AD_TENANT_ID=your_tenant_id
AZURE_AD_CLIENT_ID=your_client_id
AZURE_AD_CLIENT_SECRET=your_secret

JWT_SECRET=your_secure_random_string
```

#### Frontend Setup

```bash
cd frontend
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
REACT_APP_AZURE_CLIENT_ID=your_client_id
REACT_APP_AZURE_TENANT_ID=your_tenant_id
```

### 4. Database Setup

```bash
cd backend

# Install dependencies
npm install

# Create database
createdb securechat_db

# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:3000
```

## Code Style & Conventions

### TypeScript
- Use strict mode
- Define interfaces for all objects
- Avoid `any` type
- Use explicit return types for functions

### Naming Conventions
- **Files**: camelCase (e.g., `userService.ts`)
- **Directories**: lowercase (e.g., `services/`)
- **Classes**: PascalCase (e.g., `UserService`)
- **Functions/Variables**: camelCase (e.g., `getUserById()`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_POINTS`)

### React Components
- Use functional components with hooks
- Use descriptive names (e.g., `UserProfileCard.tsx`)
- Place styles in separate CSS files or use Tailwind
- Prop validation with TypeScript interfaces

### API Response Format
```typescript
{
  status: 'success' | 'error',
  data?: any,
  error?: string,
  statusCode: number
}
```

## Git Workflow

### Branch Naming
- Feature: `feature/description`
- Bug fix: `bugfix/description`
- Documentation: `docs/description`

### Commit Messages
- Use present tense: "Add feature" not "Added feature"
- Be descriptive: "Add user authentication" not "Update code"
- Reference issues: "Fixes #123"

Example:
```
git commit -m "Add chatbot message history feature - Fixes #456"
```

### Pull Request Process
1. Create feature branch from `develop`
2. Make changes and commit
3. Push to remote
4. Create Pull Request
5. Wait for code review
6. Merge when approved

## Development Workflow

### Adding a New Feature

1. **Backend**
   - Create route in `src/api/routes/`
   - Add controller in `src/api/controllers/`
   - Add service logic in `src/services/`
   - Update database schema if needed
   - Write tests

2. **Frontend**
   - Create page or component in `src/pages/` or `src/components/`
   - Create service in `src/services/`
   - Add route to `App.tsx`
   - Use TypeScript for type safety

### Database Changes
```bash
# Create migration
touch database/migrations/XXX_description.ts

# Run migrations
npm run db:migrate

# Rollback if needed
npm run db:rollback
```

## Testing

### Backend Tests
```bash
cd backend
npm test
npm test -- --watch  # Watch mode
npm test -- --coverage  # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Debugging

### VS Code Debugging - Backend

Add to `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Attach to Backend",
      "port": 9229,
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

Start backend with debugger:
```bash
npm run dev -- --inspect
```

### Browser DevTools - Frontend
- React DevTools extension
- Redux DevTools (if using Redux)
- Network tab for API debugging

## Performance Optimization

### Frontend
- Use React.memo for expensive components
- Implement code splitting with lazy loading
- Optimize bundle size
- Use React Query for caching

### Backend
- Add database indexes for frequently queried fields
- Implement caching for static data
- Use pagination for large datasets
- Optimize AI API calls

## Common Issues & Solutions

### Database Connection Failed
```bash
# Check PostgreSQL is running
psql -U postgres -d securechat_db

# Check connection string in .env
```

### Port Already in Use
```bash
# Find process on port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### npm install Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## Useful Commands

```bash
# Backend
npm run dev              # Start dev server
npm run build            # Build TypeScript
npm test                 # Run tests
npm run lint             # Run linter
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database

# Frontend
npm run dev              # Start dev server
npm run build            # Build for production
npm test                 # Run tests
```

## Resources

- [Express.js Documentation](https://expressjs.com)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)

## Getting Help

- Check existing issues on GitHub
- Ask questions in team chat
- Create a new issue for bugs
- Document solutions in wiki
