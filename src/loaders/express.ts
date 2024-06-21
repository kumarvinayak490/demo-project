import express from "express";
import type { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import config from "../config";
import indexRouter from "../routes";
import {
  notFoundHandler,
  globalErrorHandler,
} from "../routes/middlewares/error";
import passport from "passport";
import { jwtStrategy } from "../services/passport";

export default async function ({ app }: { app: Express }) {
  // status check
  app.get("/status", (req, res) => res.sendStatus(200).end());
  app.head("/status", (req, res) => res.sendStatus(200).end());

  // reveal origin ip from reverse proxies
  app.enable("trust proxy");

  // middlewares
  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(morgan(config.logs.morgan));

  app.use(passport.initialize());
  passport.use("jwt", jwtStrategy);

  // routes
  app.use("/dev", indexRouter());

  // error handlers
  app.use(notFoundHandler);
  app.use(globalErrorHandler);
}
