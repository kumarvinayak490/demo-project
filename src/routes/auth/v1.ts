import { Router } from "express";
import {validate} from "express-validation"
import { login as loginController, register as registerController } from "../../controllers/auth.controller";
import { login as loginValidator,  register as registerValidator } from "../../validators/auth.validators";
import authorize from "../middlewares/authorization";

export default function (app: Router) {
  const route = Router();
  app.use("/v1", route);

  route.post("/register", validate(registerValidator),  registerController)
  route.post("/login", validate(loginValidator), loginController)

  route.get("/profile", authorize(),(req,res)=>res.json({"message":"accessed"}) )
   
}
