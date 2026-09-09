import { Request, Response, NextFunction } from 'express';

// Define a custom error format according to the ERROR_HANDLING.md spec
export interface ApiError extends Error {
  statusCode: number;
  code: string;
  errors?: any[];
}

export const errorHandler = (
  err: ApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Extract specific properties or provide defaults
  const statusCode = (err as ApiError).statusCode || 500;
  const code = (err as ApiError).code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred.';
  const errors = (err as ApiError).errors || [];

  // Don't leak stack traces in production responses
  const isProduction = process.env.NODE_ENV === 'production';

  console.error(`[Error] ${code}: ${message}`, isProduction ? '' : err.stack);

  res.status(statusCode).json({
    success: false,
    message,
    code,
    errors,
  });
};
