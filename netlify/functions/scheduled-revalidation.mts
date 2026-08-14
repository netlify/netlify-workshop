import type { Config } from "@netlify/functions";
import { purgeCache } from "@netlify/functions";

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

  // Same operation the on-demand /api/purge-cache endpoint performs.
  await purgeCache({ tags: [CACHE_TAG] });

  console.log("Revalidation complete.");
};

export const config: Config = {
  schedule: "@daily",
};
