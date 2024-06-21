import { Router } from "express";
import authRouter from "./auth";

export default function () {
  const app = Router();
  authRouter(app);
  return app;
}

