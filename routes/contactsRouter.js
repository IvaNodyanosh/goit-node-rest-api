import express from "express";
import { objectIdValidator } from "../helpers/objectIdValidator.js";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact
} from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", objectIdValidator, getOneContact);

contactsRouter.delete("/:id", objectIdValidator, deleteContact);

contactsRouter.post("/", createContact);

contactsRouter.put("/:id", objectIdValidator, updateContact);

contactsRouter.patch("/:id/favorite", objectIdValidator, updateStatusContact);

export default contactsRouter;
