import * as todoService from "./services/todoService.js";
import { cacheMethodCalls } from "./util/cacheUtil.js";

const cachedtodoService = cacheMethodCalls(todoService, ["AddTodo", "DeleteTodosById"]);

const handleGetTodos = async (request) => {
  return Response.json(await cachedtodoService.GetAllTodos());
};

const handleGetTodoById = async (request, urlPatternResult) => {
  try {
    const id = urlPatternResult.pathname.groups.id;
    const todo = await cachedtodoService.GetTodoById(id);
    if (todo!==undefined && todo.length>0) {
      return Response.json(todo[0]);
    } else {
      return new Response("Not found", { status: 404 });
    }
  } catch (e) {
    return new Response("Not found", { status: 400 });
  }
};

const handlePostTodos = async (request) => {
  try {
    const todo = await request.json();
    if (!todo.item) {
        return new Response("Not found", { status: 400 });
    }
    await cachedtodoService.AddTodo(todo.item);
    return new Response("OK", { status: 200 });
  } catch (e) {
    return new Response("Not found", { status: 400 });
  }
};

const handleDeleteTodosById = async (request, urlPatternResult) => {
  try {
    const id = urlPatternResult.pathname.groups.id;
    await cachedtodoService.DeleteTodosById(id);
    return new Response("OK", { status: 200 });
  } catch (e) {
    return new Response("Not found", { status: 404 });
  }
};

const urlMapping = [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/todos" }),
    fn: handleGetTodos,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/todos/:id" }),
    fn: handleGetTodoById,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/todos" }),
    fn: handlePostTodos,
  },
  {
    method: "DELETE",
    pattern: new URLPattern({ pathname: "/todos/:id" }),
    fn: handleDeleteTodosById,
  },
];

const handleRequest = async (request) => {
  const mapping = urlMapping.find(
    (um) => um.method === request.method && um.pattern.test(request.url),
  );

  if (!mapping) {
    return new Response("Not found", { status: 404 });
  }

  const mappingResult = mapping.pattern.exec(request.url);
  return await mapping.fn(request, mappingResult);
};

Deno.serve({ port: 7777 }, handleRequest);