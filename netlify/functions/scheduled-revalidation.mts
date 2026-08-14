import type { Config } from "@netlify/functions";
import { purgeCache } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

// Must match the `Cache-Tag` header set by /rendering-strategies/scheduled-revalidation
const CACHE_TAG = "scheduled-revalidation";

export default async (req: Request) => {
  let nextRun: string | null = null;

  try {
    ({ next_run: nextRun } = await req.json());
  } catch {
    // Invoked without a body (e.g. `netlify functions:invoke`)
  }

  console.log(`Revalidating cache tag: ${CACHE_TAG}. Next run: ${nextRun}`);

  const store = getStore("revalidation-store");
  const previous = (await store.get("scheduled", { type: "json" })) as {
    runCount?: number;
  } | null;

  await purgeCache({ tags: [CACHE_TAG] });

  await store.setJSON("scheduled", {
    purgedAt: new Date().toISOString(),
    nextRun,
    runCount: (previous?.runCount ?? 0) + 1,
  });

  console.log("Revalidation complete.");
};

export const config: Config = {
  schedule: "@daily",
};
