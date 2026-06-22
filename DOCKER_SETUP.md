# SecureChat Docker Setup

## Development Environment

### Prerequisites
- Docker
- Docker Compose
- 4GB minimum RAM

### Quick Start

1. **Build and run containers:**
```bash
docker-compose up --build
```

2. **Run database migrations:**
```bash
docker-compose exec backend npm run db:migrate
docker-compose exec backend npm run db:seed
```

3. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Database: localhost:5432

### Commands

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild containers
docker-compose up --build

# Run migrations
docker-compose exec backend npm run db:migrate

# Access backend shell
docker-compose exec backend sh

# Access database
docker-compose exec postgres psql -U postgres -d securechat_db
```

## Production Environment

### Prerequisites
- Docker & Docker Compose installed
- Production environment variables configured
- SSL certificates ready

### Setup

1. **Create .env file for production:**
```bash
cp .env.production.example .env.production
# Edit with production values
```

2. **Start production stack:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables (Production)

Create a `.env.production` file:
```env
DB_PASSWORD=secure-password
OPENAI_API_KEY=your-key
AZURE_AD_TENANT_ID=your-tenant
AZURE_AD_CLIENT_ID=your-client-id
AZURE_AD_CLIENT_SECRET=your-secret
JWT_SECRET=your-long-secure-secret
FRONTEND_URL=https://your-domain.com
API_URL=https://api.your-domain.com
REACT_APP_AZURE_CLIENT_ID=your-client-id
REACT_APP_AZURE_TENANT_ID=your-tenant
REACT_APP_REDIRECT_URI=https://your-domain.com
```

### Health Checks

Backend health check endpoint:
```bash
curl http://localhost:5000/health
```

### Database Backup

```bash
# Backup
docker-compose exec postgres pg_dump -U postgres securechat_db > backup.sql

# Restore
docker-compose exec -T postgres psql -U postgres securechat_db < backup.sql
```

### Troubleshooting

**Port already in use:**
```bash
# Change ports in docker-compose.yml or kill existing process
lsof -i :5000  # Find process
kill -9 <PID>  # Kill process
```

**Database connection error:**
```bash
# Check database logs
docker-compose logs postgres

# Verify database is running
docker-compose exec postgres psql -U postgres -c "SELECT 1"
```

**Out of memory:**
- Increase Docker desktop memory allocation
- Or use `--memory` flag when running containers

### Scaling Notes

For production scaling:
1. Use managed database (RDS, Azure Database)
2. Deploy with Kubernetes or container orchestration
3. Use load balancer for backend instances
4. Implement caching layer (Redis)
5. Use CDN for frontend assets
