import express from "express";
import {
  getCurrent,
  registerUser,
    logInUser,
  logout
} from "../controllers/usersControllers.js";
import { authenticate } from "../helpers/authenticate.js"

const usersRouter = express.Router();

usersRouter.post("/register", registerUser);
usersRouter.post("/login", logInUser);
usersRouter.get("/current", authenticate, getCurrent);
usersRouter.post("/logout", authenticate, logout);
usersRouter.patch("/", authenticate)

export default usersRouter;
