import express from "express";
import {
  getCurrent,
  registerUser,
  logInUser,
  logout,
  changeSubscriptionUser,
  changeAvatar,
} from "../controllers/usersControllers.js";
import { authenticate } from "../helpers/authenticate.js";
import { upload } from "../helpers/uploadImg.js";

const usersRouter = express.Router();

usersRouter.post("/register", registerUser);
usersRouter.post("/login", logInUser);
usersRouter.get("/current", authenticate, getCurrent);
usersRouter.post("/logout", authenticate, logout);
usersRouter.patch("/", authenticate, changeSubscriptionUser);
usersRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  changeAvatar
);

export default usersRouter;
