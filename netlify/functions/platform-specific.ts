import type { Config, Context } from "@netlify/functions";

// Imagine this is the response of one API endpoint...
const nintendo = {
  products: [
    { id: "n1", name: "Nintendo Gameboy Advance", promo: "web" },
    { id: "n2", name: "Super Nintendo", promo: null },
    { id: "n3", name: "Nintendo 64", promo: "mobile" },
    { id: "n4", name: "Nintendo Gamecube", promo: null },
    { id: "n5", name: "Nintendo Switch", promo: "mobile" },
  ],
};

// ...and this is the response of a separate endpoint...
const sony = {
  products: [
    { id: "s1", name: "Sony PSP", promo: "web" },
    { id: "s2", name: "Sony PlayStation 3", promo: "mobile" },
    { id: "s3", name: "Sony PlayStation 4", promo: "mobile" },
    { id: "s4", name: "Sony PlayStation 5", promo: "mobile" },
  ],
};

export default async (req: Request, context: Context) => {
  const { platform } = context.params;

  // ... you can combine them into a single endpoint ...
  const allProducts = nintendo.products.concat(sony.products);

  if (!platform) {
    // @ts-expect-error Response.json() does not require `new` operator
    return Response.json(allProducts);
  }

  // ... and/or filter as needed
  const filteredProducts = allProducts.filter(
    (product) => product.promo === platform,
  );
  // @ts-expect-error Response.json() does not require `new` operator
  return Response.json(filteredProducts);
};

export const config: Config = {
  method: "GET",
  path: "/api/consoles{/:platform}?", // https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API
};
