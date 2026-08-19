# Deployment Guide

> This document contains older multi-provider examples. The supported low-cost deployment for SecureChat is documented in [AZURE_LOW_COST_DEPLOYMENT.md](AZURE_LOW_COST_DEPLOYMENT.md). Do not follow the Heroku, AWS, Redis, Kubernetes, or premium networking examples for the three-month demo.

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Environment variables configured
- [ ] Database backups created
- [ ] Security scan completed
- [ ] Performance tests passed

## Backend Deployment

### Option 1: Heroku

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create app
heroku create securechat-api

# Add PostgreSQL add-on
heroku addons:create heroku-postgresql:standard-0 -a securechat-api

# Set environment variables
heroku config:set NODE_ENV=production -a securechat-api
heroku config:set JWT_SECRET=your_production_secret -a securechat-api
heroku config:set OPENAI_API_KEY=your_key -a securechat-api

# Deploy
git push heroku main

# Run migrations
heroku run npm run db:migrate -a securechat-api

# View logs
heroku logs --tail -a securechat-api
```

### Option 2: AWS (EC2 + RDS)

1. **Create EC2 instance**
   - Choose Ubuntu 20.04 LTS
   - Configure security groups (allow 443, 80, 5000)
   - Create key pair for SSH access

2. **Setup instance**
   ```bash
   # SSH into instance
   ssh -i your-key.pem ubuntu@your-instance-ip

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2 (process manager)
   sudo npm install -g pm2

   # Clone repository
   git clone https://github.com/your-org/securechat.git
   cd securechat/backend
   npm install
   npm run build
   ```

3. **Configure RDS**
   - Create PostgreSQL database
   - Get connection string
   - Update environment variables

4. **Setup PM2**
   ```bash
   pm2 start dist/index.js --name "securechat-api"
   pm2 startup
   pm2 save
   ```

5. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt-get install certbot
   sudo certbot certonly --standalone -d your-domain.com
   ```

### Option 3: Azure App Service

```bash
# Login to Azure
az login

# Create resource group
az group create --name securechat-rg --location eastus

# Create App Service plan
az appservice plan create --name securechat-plan --resource-group securechat-rg --sku B1 --is-linux

# Create App Service
az webapp create --resource-group securechat-rg --plan securechat-plan --name securechat-api --runtime "node|18-lts"

# Configure deployment
az webapp config appsettings set --resource-group securechat-rg --name securechat-api --settings NODE_ENV=production

# Deploy
az webapp up --resource-group securechat-rg --name securechat-api
```

## Frontend Deployment

### Option 1: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd frontend
netlify deploy --prod --dir=dist

# Or connect to GitHub for auto-deployment
netlify init
```

### Option 2: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod
```

### Option 3: AWS S3 + CloudFront

```bash
# Build frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name

# Create CloudFront distribution (via AWS Console)
# Point to S3 bucket as origin
# Configure SSL certificate
```

## Database Migration in Production

```bash
# Create backup
pg_dump your-db-name > backup.sql

# Run migrations
npm run db:migrate

# If needed, rollback
npm run db:rollback
```

## Environment Variables - Production

### Backend Production .env
```env
NODE_ENV=production
PORT=5000
API_URL=https://api.your-domain.com

# Secure database configuration
DB_HOST=your-rds-endpoint
DB_PORT=5432
DB_NAME=securechat_db
DB_USER=postgres
DB_PASSWORD=your-strong-password

# Production Azure AD
AZURE_AD_TENANT_ID=prod_tenant_id
AZURE_AD_CLIENT_ID=prod_client_id
AZURE_AD_CLIENT_SECRET=prod_secret

# OpenAI
OPENAI_API_KEY=prod_openai_key
OPENAI_MODEL=gpt-4

# JWT with secure secret
JWT_SECRET=prod-secure-secret-256-characters-long
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=https://your-domain.com

# Logging
LOG_LEVEL=info
```

### Frontend Production .env
```env
VITE_API_URL=https://api.your-domain.com/api
REACT_APP_AZURE_CLIENT_ID=prod_client_id
REACT_APP_AZURE_TENANT_ID=prod_tenant_id
REACT_APP_REDIRECT_URI=https://your-domain.com
```

## Performance Optimization for Production

### Backend
- Enable gzip compression
- Implement Redis caching
- Use connection pooling
- Enable query optimization
- Setup CDN for static assets

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- CSS/JS minification
- Service Workers for offline capability

## Monitoring & Logging

### Backend Monitoring
```bash
# Using PM2
pm2 monit

# Or setup: DataDog, New Relic, CloudWatch
```

### Frontend Error Tracking
- Setup Sentry for error tracking
- Google Analytics for user analytics
- Log Rocket for session replay

## Security Hardening

1. **Enable HTTPS/SSL**
   - Use certificates from Let's Encrypt
   - Enforce HTTPS redirect

2. **Database Security**
   - Enable encryption at rest
   - Use VPC/private subnets
   - Regular backups

3. **API Security**
   - Rate limiting
   - Input validation
   - CORS configuration
   - SQL injection prevention

4. **Secrets Management**
   - Use env variables
   - Rotate secrets regularly
   - Never commit secrets

## Rollback Plan

```bash
# If deployment fails
# 1. Identify the issue
# 2. Revert code to previous version
git revert HEAD

# 3. Rebuild and redeploy
npm run build

# 4. If database changes caused issues
npm run db:rollback

# 5. Restore from backup if needed
psql database_name < backup.sql
```

## Post-Deployment Verification

- [ ] Check health endpoint: `https://api.your-domain.com/health`
- [ ] Test authentication
- [ ] Verify database connections
- [ ] Check OpenAI API integration
- [ ] Test chat functionality
- [ ] Monitor error logs
- [ ] Verify SSL certificate
- [ ] Check CORS configuration
- [ ] Load test API endpoints
- [ ] Verify analytics pipeline

## Support & Troubleshooting

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Check database connectivity
4. Review security group rules
5. Contact cloud provider support
