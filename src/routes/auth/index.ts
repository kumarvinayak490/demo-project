import { Router } from "express";
import v1AuthRouter from "./v1";

export default function (app: Router) {
  const route = Router();
  app.use("/auth", route);
  v1AuthRouter(route)
  return route;
}
