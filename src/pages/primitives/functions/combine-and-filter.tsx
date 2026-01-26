import { useEffect, useState } from "react";
import Nav from "~/components/Nav";

interface Product {
  id: number;
  name: string;
  promo: string | null;
}

export default function PlatformSpecific() {
  const [platform, setPlatform] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts(platform);
  }, [platform]);

  const fetchProducts = async (platform: string) => {
    const response = await fetch(`/api/consoles/${platform}`);
    const data = await response.json();
    setProducts(data);
  };

  return (
    <>
      <Nav title="Combine and filter API responses" />
      <main>
        <div className="page-header">
          <h1>Combine & Filter</h1>
          <p>Serve different content based on platform</p>
        </div>

        <section className="info-box">
          <p>
            Current platform: <strong>{platform || "All"}</strong>
          </p>
          <code>GET /api/consoles/{platform || ""}</code>
        </section>

        <section>
          <div className="button-group">
            <button
              className={!platform ? "" : "secondary"}
              onClick={() => setPlatform("")}
              disabled={!platform}
            >
              All
            </button>
            <button
              className={platform === "web" ? "" : "secondary"}
              onClick={() => setPlatform("web")}
              disabled={platform === "web"}
            >
              Web
            </button>
            <button
              className={platform === "mobile" ? "" : "secondary"}
              onClick={() => setPlatform("mobile")}
              disabled={platform === "mobile"}
            >
              Mobile
            </button>
          </div>
        </section>

        <section>
          <h2>Products</h2>
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                {product.name}
                {product.promo && <strong> &mdash; {product.promo}</strong>}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
