import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import logger from './config/logger';
import { errorHandler } from './api/middleware/errorHandler';
import authRoutes from './api/routes/authRoutes';
import chatRoutes from './api/routes/chatRoutes';
import userRoutes from './api/routes/userRoutes';
import gamificationRoutes from './api/routes/gamificationRoutes';
import analyticsRoutes from './api/routes/analyticsRoutes';

// Load environment variables
dotenv.config();

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be configured in production');
}

const app: Express = express();
const DEFAULT_PORT = Number(process.env.PORT) || 5000;

const startServer = (port: number) => {
  const server = app.listen(port, '0.0.0.0', () => {
    logger.info(`Server running on port ${port}`);
  });

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      logger.warn(`Port ${port} is busy. Trying ${port + 1}...`);
      startServer(port + 1);
      return;
    }

    logger.error('Failed to start server', error);
    process.exit(1);
  });
};

// Middleware
app.use(helmet());
app.use(cors({
  origin: (process.env.FRONTEND_URL || 'http://localhost:3000').split(',').map((value) => value.trim()),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
startServer(DEFAULT_PORT);

export default app;
