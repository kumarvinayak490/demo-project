import { error } from "console";
import type { Request, Response, NextFunction } from "express";
import { ValidationError } from "express-validation";

export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const error = new Error(`path ${req.originalUrl} not found`);
  error["status"] = 404;
  next(error);
}

export function globalErrorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {

  if(error instanceof ValidationError){
    return res.status(error.statusCode).json(error)
  }
  res.status(error["status"] || 500);
  res.json({ error: { message: error.message } });
}
