import type { Config, Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  // Here's what's available on context.geo

  // context: {
  //   geo: {
  //     city?: string;
  //     country?: {
  //       code?: string;
  //       name?: string;
  //     },
  //     subdivision?: {
  //       code?: string;
  //       name?: string;
  //     },
  //     latitude?: number;
  //     longitude?: number;
  //     timezone?: string;
  //   }
  // }

  // @ts-expect-error use `Response.json()` to set content-type as application/json
  return Response.json({
    geo: context.geo,
  });
};

export const config: Config = {
  path: "/geolocation",
};
