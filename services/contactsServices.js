import { Contact } from "../schemas/contactsSchemas.js";

export async function listContacts() {
  const data = await Contact.find();
  return data;
}

export async function getContactById(contactId) {
  const data = await Contact.findOne({ _id: contactId });

  return data || null;
}

export async function removeContact(contactId) {
  const data = await Contact.findOneAndDelete({ _id: contactId });

  return data || null;
}

export async function addContact({ name, email, phone, favorite }) {
  const contact = { name, email, phone };

  if (typeof favorite === "boolean" || favorite) {
    contact.favorite = favorite;
  }

  const data = Contact.create(contact);
  return data;
}

export async function renovationContact(id, { name, email, phone, favorite }) {
  const contact = {};

  if (name) {
    contact.name = name;
  }
  if (email) {
    contact.email = email;
  }
  if (phone) {
    contact.phone = phone;
  }

  if (typeof favorite === 'boolean' || favorite) {
    contact.favorite = favorite;
  }

  if (!contact) {
    return undefined;
  }

  const data = await Contact.findOneAndUpdate({ _id: id }, contact, {
    new: true,
    versionKey: false,
  });

  return data;
}

export async function renovationStatusContact(id, { favorite }) {
  

    const data = await Contact.findOneAndUpdate({ _id: id }, {favorite}, {
      new: true,
      versionKey: false,
    });

    return data;
}