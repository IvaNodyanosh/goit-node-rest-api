import { listContacts } from "../services/contactsServices.js";
import { getContactById } from "../services/contactsServices.js";
import { removeContact } from "../services/contactsServices.js";
import { addContact } from "../services/contactsServices.js";
import { renovationContact } from "../services/contactsServices.js";
import { renovationStatusContact } from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";

import { createContactSchema } from "../schemas/contactsSchemas.js";
import { updateContactSchema } from "../schemas/contactsSchemas.js";
import { updateStatusContactSchema } from "../schemas/contactsSchemas.js";
import { contactByIdSchema } from "../schemas/contactsSchemas.js";

export const getAllContacts = async (__, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { error } = contactByIdSchema.validate({id});
    if (error) {
      throw HttpError(400, error.message);
    }
    const contact = await getContactById(id);
    if (contact) {
      res.status(200).json(contact);
    } else {
      throw HttpError(404);
    }
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = contactByIdSchema.validate({id});
    if (error) {
      throw HttpError(400, error.message);
    }
    const contact = await removeContact(id);
    if (!contact) {
      throw HttpError(404);
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const contact = await addContact(req.body);
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      throw HttpError(400, "Body must have at least one field");
    }
    const { id } = req.params;
    const { e } = contactByIdSchema.validate({ id });
    if (e) {
      throw HttpError(400, error.message);
    }
    const contact = await renovationContact(id, req.body);

    if (!contact) {
      throw HttpError(404);
    }

    const { error } = updateContactSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }

    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { e } = contactByIdSchema.validate({ id });
    if (e) {
      throw HttpError(400, error.message);
    }
    const { error } = updateStatusContactSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }

    const data = await renovationStatusContact(id, req.body);

    if (!data) {
      throw HttpError(404);
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
