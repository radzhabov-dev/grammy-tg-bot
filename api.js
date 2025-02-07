import { $api } from "./instance.js";


export const registrationOfNewUsers = async (user) => {
  const users = await fetchUsers()
  const isRegisterUser = users.some(u => u.id === user.id)
  console.log(isRegisterUser);
  console.log(users)
  if (isRegisterUser) return console.log("Пользователь уже добавлен.")
  await $api.post('/users', user);
  return console.log("Добро пожаловать!")
};

export const fetchProducts = async () => {
  const { data: products } = await $api.get("/products");
  return products;
};

export const fetchProductsByCategoryId = async (id) => {
  const products = await fetchProducts();
  return products.filter(p => p.category_id === id);
};

export const fetchCategories = async () => {
  const { data: categories } = await $api.get("/categories");
  return categories;
};

export const fetchUsers = async () => {
  const { data: users } = await $api.get("/users");
  return users;
};

export const addingUsers = async (body) => {
  const { data: users } = await fetchUsers();
  const isEmptyUser = users.find(
    (user) => user.user_id === body.user_id
  );

  if (isEmptyUser) return "Пользователь уже существует в базе!";

  try {
    await $api.post("/users", body);
    return "Новый пользователь добавлен в базу!";
  } catch (e) {
    console.log(JSON.stringify(e));
    return "Что-то пошло не так!";
  }
};
