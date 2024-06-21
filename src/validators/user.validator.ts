import Joi from "joi";
import User from "../models/user.model";

export const createUser = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
    name: Joi.string().max(128),
    role: Joi.string().valid(User.roles),
  },
};
