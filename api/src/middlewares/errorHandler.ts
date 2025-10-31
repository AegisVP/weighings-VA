import type { NextFunction, Request, Response } from 'express';
import type { TypeCustomError } from '../utils/requrestError.js';

// Centralized error handling middleware
export function errorHandler(err: TypeCustomError, _req: Request, res: Response, _next: NextFunction) {
  console.error(`App error handler: [${err.name}] - ${err.message}`);

  if (err.name === 'CastError' || err.name === 'ValidationError') {
    return res.status(400).json({
      message: err.message,
    });
  }

  if (err.status) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: 'Internal server error',
    details: { name: err.name, message: err.message },
  });
}
