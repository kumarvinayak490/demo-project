import jwt from "jsonwebtoken";
import config from "../config";
import httpStatus from "http-status";
import {v4 as uuidv4} from "uuid";
import type { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const activationKey = uuidv4();
    const body = req.body;
    body.activationKey = activationKey;
    const user = new User(body);
    const savedUser = await user.save();
    res.status(httpStatus.CREATED);
    res.send(savedUser.transform());
  } catch (err) {
    return next(User.checkDuplicateEmailError(err));
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findAndGenerateToken(req.body)
        const payload = {sub: user.id}
        const token = jwt.sign(payload, config.secret)
        return res.json({ message: 'OK', token: token })
      } catch (error) {
        next(error)
      }
};
