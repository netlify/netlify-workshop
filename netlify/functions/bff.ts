const data = { 
  products: [
    { id: 1, name: 'Gameboy Advance', promo: 'web'},
    { id: 2, name: 'N64', promo: 'mobile'},
    { id: 3, name: 'Gamecube', promo: null}
  ] 
};

export default async (req: Request) => {

  const query = new URL(req.url).searchParams;

  if (query.get("platform") == "web") {
    const webData = data.products.filter((product) => product.promo === "web" || !product.promo);
    return new Response(JSON.stringify(webData), { status: 200 });
  }

  if (query.get("platform") == "mobile") {
    const mobileData = data.products.filter((product) => product.promo === "mobile" || !product.promo);
    return new Response(JSON.stringify(mobileData), { status: 200 });
  }

  return new Response("Unsupported method", { status: 405 });
};
