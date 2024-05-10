import Joi from "joi";
import { Schema, model } from "mongoose";

export const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().pattern(emailRegexp),
  phone: Joi.string(),
  favorite: Joi.boolean(),
});

export const updateStatusContactSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const contact = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      match: emailRegexp,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

export const Contact = model("contact", contact);
