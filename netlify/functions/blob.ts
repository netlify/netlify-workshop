import { getStore } from "@netlify/blobs";
import type { Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  const store = getStore("ntl-workshop-todos");

  if(req.method === "GET") {
    const todos = await store.get("todos");
    return new Response(todos || JSON.stringify([]), { status: 200 });
  }

  if(req.method === "POST") {
    const body = await req.json();
    await store.set("todos", JSON.stringify(body));
    return new Response("Todos updated", { status: 200 });
  }

  return new Response("Unsupported method");
};