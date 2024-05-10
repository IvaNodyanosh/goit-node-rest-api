import HttpError from "./HttpError.js";
import jsonwebtoken from "jsonwebtoken";
import { User } from "../schemas/usersSchemas.js";
import { config } from "dotenv";

config();

const { SECRET_KEY } = process.env;

export const authenticate = async (req, __, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(HttpError(401));
  }

  try {
    const { id } = jsonwebtoken.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user) {
      next(HttpError(401));
    }

    req.user = user;

    next();
  } catch {
    next(HttpError(401));
  }
};
