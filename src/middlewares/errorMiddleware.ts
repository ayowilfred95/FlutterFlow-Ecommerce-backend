import { Request, Response, NextFunction } from "express";

/**
 * Middleware function that handles 404 errors.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
const notFound = (req: Request, res: Response, next: NextFunction) => {
  // Create new error object with descriptive message
  const error = new Error(`Not Found --> ${req.originalUrl}`);

  // Set response status to 404
  res.status(404);

  // Pass error object to next middleware
  next(error);
};

/**
 * Express middleware that handles errors in a consistent way.
 *
 * @param {Error} err - The error object.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Set the status code to 500 if it was not already set.
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // Send a JSON response with the error message and stack trace (in development mode).
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? {} : err.stack,
  });
};

export { notFound, errorHandler };
