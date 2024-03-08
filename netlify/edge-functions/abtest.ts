import type { Config, Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const response = await context.next();

  // look for existing "ab-test-bucket" cookie
  const bucketName = "ab-test-bucket";
  const bucket = context.cookies.get(bucketName);

  // return here if we find a cookie
  if (bucket) {
    return response;
  }

  // if no "ab-test-bucket" cookie is found, assign the user to a bucket
  // in this example we're using two buckets (a, b) with an equal weighting of 50/50
  const weighting = 0.5;

  // get a random number between (0-1)
  // this is a basic example and you may want to experiment
  const random = Math.random();
  const newBucketValue = random <= weighting ? "A" : "B";

  // set the new "ab-test-bucket" cookie
  context.cookies.set({
    name: bucketName,
    value: newBucketValue,
    path: "/",
  });

  return response;
};

export const config: Config = {
  path: "/*",
};
