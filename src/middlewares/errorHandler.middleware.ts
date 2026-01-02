import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiError';

export interface AppError extends Error {
  status?: number;
}

export const errorHandler = (
  err: Error | ApiError,
  _: Request,
  res: Response,
  __: NextFunction
): void => {
  console.log('calling the for next');
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || 'Internal server error';
  res
    .status(statusCode)
    .json({
      success: false,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
