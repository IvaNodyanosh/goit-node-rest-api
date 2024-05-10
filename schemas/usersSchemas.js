import Joi from "joi";
import { Schema, model } from "mongoose";

import { emailRegexp } from "./contactsSchemas.js";

export const registerUserSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

export const changeSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const user = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: emailRegexp,
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

export const User = model("user", user);
