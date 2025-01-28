import { $api } from "./instance.js";

export const fetchPosts = async () => {
  return await $api.get("/posts");
};

export const fetchComments = async () => {
  return await $api.get("/comments");
};

export const fetchEmployees = async () => {
  return await $api.get("/profile");
};

export const fetchContacts = async () => {
  return await $api.get("/contacts");
};

export const addingContact = async (body) => {
  const { data: contacts } = await fetchContacts();
  const isEmptyContact = contacts.find(
    (contact) => contact.user_id === body.user_id,
  );

  if (isEmptyContact) return "Контакт уже существует в базе!";

  try {
    await $api.post("/contacts", body);
    return "Спасибо. Ваш контакт добавлен в базу!";
  } catch (e) {
    console.log(JSON.stringify(e));
    return "Что-то пошло не так!";
  }
};
