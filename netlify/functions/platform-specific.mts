import type { Config, Context } from "@netlify/functions";

const nintendo = {
    products: [
        { id: "n1", name: "Nintendo Gameboy Advance", promo: "web" },
        { id: "n2", name: "Super Nintendo", promo: null },
        { id: "n3", name: "Nintendo 64", promo: "mobile" },
        { id: "n4", name: "Nintendo Gamecube", promo: null },
        { id: "n5", name: "Nintendo Switch", promo: "mobile" },
    ],
};

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

    const allProducts = nintendo.products.concat(sony.products);

    if (!platform) {
        return Response.json(allProducts);
    }

    const filteredProducts = allProducts.filter(
        (product) => product.promo === platform,
    );
    return Response.json(filteredProducts);
};

export const config: Config = {
    method: "GET",
    path: "/api/consoles{/:platform}?",
};
