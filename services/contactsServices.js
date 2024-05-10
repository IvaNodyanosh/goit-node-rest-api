import { Contact } from "../schemas/contactsSchemas.js";

export async function listContacts(user, skip, limit, favorite) {
  const { _id: owner } = user;

  if (typeof favorite === "boolean") {
    const data = await Contact.find(
      { owner, favorite },
      "-createAt, -updateAt",
      {
        skip,
        limit,
      }
    );
    return data;
  };

  const data = await Contact.find({ owner }, "-createAt, -updateAt", {
    skip,
    limit,
  });
  return data;
}

export function getContactById(contactId, user) {
  const { _id: owner } = user;
  return Contact.findOne({ _id: contactId, owner });
}

export async function removeContact(contactId, user) {
  const { _id: owner } = user;

  const data = await Contact.findOneAndDelete({ _id: contactId, owner });

  return data;
}

export async function addContact(contact, user) {
  const { _id: owner } = user;

  const data = Contact.create({ ...contact, owner });
  return data;
}

export async function renovationContact(
  id,
  { name, email, phone, favorite },
  user
) {
  const { _id: owner } = user;

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

  if (typeof favorite === "boolean" || favorite) {
    contact.favorite = favorite;
  }

  if (!contact) {
    return undefined;
  }

  const data = await Contact.findOneAndUpdate({ _id: id, owner }, contact, {
    new: true,
    versionKey: false,
  });

  return data;
}

export async function renovationStatusContact(id, { favorite }, user) {
  const { _id: owner } = user;

  const data = await Contact.findOneAndUpdate(
    { _id: id, owner },
    { favorite },
    {
      new: true,
      versionKey: false,
    }
  );

  return data;
}
