import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import reportRoutes from './routes/report.routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome & info route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Field Report Management API (MAPID Case Study)',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      createReport: 'POST /api/reports',
      getReports: 'GET /api/reports',
      updateStatus: 'PATCH /api/reports/:id/status',
    },
  });
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Field Report API is healthy',
    timestamp: new Date().toISOString(),
  });
});

// Mount reports routes under /api/reports
app.use('/api/reports', reportRoutes);

// Handle 404 for undefined routes
app.use(notFoundHandler);

// Central error handler
app.use(errorHandler);

export default app;
