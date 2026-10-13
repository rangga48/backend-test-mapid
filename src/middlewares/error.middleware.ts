import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/report.types';

/**
 * 404 Not Found Middleware for unhandled routes
 */
export const notFoundHandler = (
  req: Request,
  res: Response<ApiResponse>,
  _next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
};

/**
 * Centralized Global Error Handler Middleware
 */
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response<ApiResponse>,
  _next: NextFunction
): void => {
  // Handle JSON parse errors from body-parser
  if (err instanceof SyntaxError && 'status' in err && (err as any).status === 400 && 'body' in err) {
    res.status(400).json({
      success: false,
      message: 'Invalid JSON payload in request body',
    });
    return;
  }

  // Handle PostgreSQL invalid UUID input syntax (error code 22P02)
  if (err.code === '22P02') {
    res.status(400).json({
      success: false,
      message: 'Invalid input syntax for UUID parameter',
    });
    return;
  }

  // Handle PostgreSQL CHECK constraint violation (error code 23514)
  if (err.code === '23514') {
    res.status(400).json({
      success: false,
      message: 'Database check constraint violated: invalid status value',
    });
    return;
  }

  // Log unexpected errors
  console.error('Unhandled Server Error:', err);

  const isProduction = process.env.NODE_ENV === 'production';
  res.status(500).json({
    success: false,
    message: isProduction ? 'Internal Server Error' : err.message || 'Internal Server Error',
  });
};
