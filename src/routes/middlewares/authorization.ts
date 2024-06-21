import passport from "passport";
import httpStatus from "http-status";
import { promisify } from "util";
import type { Request, Response, NextFunction } from "express";
import User, { IUser, roles } from "../../models/user.model";
import APIError from "../../utils/APIError";


// handleJWT with roles
const handleJWT = (req:Request, res:Response, next:NextFunction) => async (err:Error, user: IUser, info:any) => {
  const error = err || info;
  const logIn = promisify(req.logIn);
  const apiError = new APIError(
    error ? error.message : "Unauthorized",
    httpStatus.UNAUTHORIZED
  );

  // log user in
  try {
    if (error || !user) throw error;    
    await logIn(user);
  } catch (e) {
    return next(apiError);
  }

  req.user = user;

  return next();
};

// exports the middleware
const authorize =
  () =>
  (req:Request, res:Response, next:NextFunction) =>
    passport.authenticate(
      "jwt",
      { session: false },
      handleJWT(req, res, next)
    )(req, res, next);

export default authorize;
