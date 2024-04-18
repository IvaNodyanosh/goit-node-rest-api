import Joi from "joi";
import { Schema, model } from "mongoose";

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean()
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean()
});

export const contactByIdSchema = Joi.object({
  id: Joi.string().required()
})

export const updateStatusContactSchema = Joi.object({
  favorite: Joi.boolean().required()
})

const contact = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

export const Contact = model('contact', contact)