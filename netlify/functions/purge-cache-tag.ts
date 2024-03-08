import { purgeCache } from "@netlify/functions";

export default async (req: Request) => {
  const url = new URL(req.url);
  const cacheTag = url.searchParams.get("tag");
  if (!cacheTag) {
    return;
  }

  console.log("Purging tag: ", cacheTag);

  await purgeCache({
    tags: [cacheTag],
  });

  return new Response("Purged!", { status: 202 })
};
