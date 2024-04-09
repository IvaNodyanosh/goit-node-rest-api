import { nanoid } from "nanoid";
import { promises } from "fs";

const contactsPath = "./db/contacts.json";

export async function listContacts() {
  const data = await promises.readFile(contactsPath);
  return JSON.parse(data);
}

export async function getContactById(contactId) {
  const contacts = await listContacts();
  const result = contacts.find((contact) => contact.id === contactId);

  return result || null;
}

export async function removeContact(contactId) {
  const contacts = await listContacts();
  let contact = null;

  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].id === contactId) {
      contact = contacts.splice(i, 1);
      await promises.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    }
  }

  if (contact) {
    return contact[0];
  }
  return null;
}

export async function addContact({ name, email, phone }) {
  const contacts = await listContacts();
  const contact = { id: nanoid(), name, email, phone };

  contacts.push(contact);

  await promises.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return contact;
}

export async function renovationContact(id, {name, email, phone}) {
  const contacts = await listContacts();
  const contact = contacts.find(contact => contact.id === id);

  if (!contact) {
    return undefined
  }

  if (name) {
    contact.name = name;
  }
  if (email) {
    contact.email = email;
  }
  if (phone) {
    contact.phone = phone;
  }
  const filterContacts = contacts.filter(contact => contact.id !== id);
  filterContacts.push(contact);
  await promises.writeFile(contactsPath, JSON.stringify(filterContacts, null, 2));

  return contact;
}
