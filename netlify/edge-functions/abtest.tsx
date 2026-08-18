import type { Config, Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const response = await context.next();

  const bucketName = "ab-test-bucket";
  const bucket = context.cookies.get(bucketName);

  if (bucket) {
    return response;
  }

  const weighting = 0.5;

  const random = Math.random();
  const newBucketValue = random <= weighting ? "A" : "B";

  context.cookies.set({
    name: bucketName,
    value: newBucketValue,
    path: "/",
  });

  return response;
};

export const config: Config = {
  path: "/primitives/edge-functions/ab-testing",
};
