import type { Config } from "@netlify/functions";

export default async function joke() {
  const URL = "https://icanhazdadjoke.com/";
  const headers = {
    Accept: "application/json",
    Authorization: Netlify.env.get("DAD_JOKE_API_KEY") || "",
  };

  try {
    const response = await fetch(URL, { headers });
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    console.log(json);
    return Response.json(json);
  } catch (error) {
    console.error("Failed to fetch a dad joke:", error);
    return new Response("Internal server error", { status: 500 });
  }
}

export const config: Config = {
  method: "GET",
  path: "/api/dad-joke",
};
