import { postgres } from "../deps.js";

const sql = postgres({});

const GetAllTodos = async () => {
  return await sql`SELECT * FROM todos WHERE 1 = 1`;
};

const GetTodoById = async (id) => {
  return await sql`SELECT * FROM todos WHERE id = ${id}`;
};

const AddTodo = async (item) => {
  return await sql`INSERT INTO todos (item) VALUES (${item})`;
};

const DeleteTodosById = async (id) => {
  await sql`DELETE FROM todos WHERE id = ${id}`;
};

export { GetAllTodos, GetTodoById, AddTodo, DeleteTodosById };