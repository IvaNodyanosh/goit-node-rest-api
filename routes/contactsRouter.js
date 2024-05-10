import express from "express";
import { objectIdValidator } from "../helpers/objectIdValidator.js";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import { authenticate } from "../helpers/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, getAllContacts);

contactsRouter.get("/:id", authenticate, objectIdValidator, getOneContact);

contactsRouter.delete("/:id", authenticate, objectIdValidator, deleteContact);

contactsRouter.post("/", authenticate, createContact);

contactsRouter.put("/:id", authenticate, objectIdValidator, updateContact);

contactsRouter.patch(
  "/:id/favorite",
  authenticate,
  objectIdValidator,
  updateStatusContact
);

export default contactsRouter;
