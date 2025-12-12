import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

export default async (req: Request) => {
    const store = getStore("ntl-workshop-todos");

    if (req.method === "GET") {
        const todos = await store.get("todos", { type: "json" });
        return Response.json(todos || [], { status: 200 });
    }

    if (req.method === "PUT") {
        const body = await req.json();
        await store.setJSON("todos", body);
        return new Response("Todos updated", { status: 200 });
    }

    return new Response("Unsupported method", { status: 405 });
};

export const config: Config = {
    path: "/.netlify/functions/blob",
};
