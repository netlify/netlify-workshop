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
    <div>
      <Nav title="Combine and filter API responses" />
      <h1>Functions: Combine and filter</h1>
      <p>
        This page demonstrates how to use platform-specific functions to serve
        different content based on the platform.
      </p>
      <p>
        The current platform is: <strong>{platform}</strong>
      </p>
      <p>
        <code>GET /api/consoles/{platform}</code>
      </p>

      <div>
        <button onClick={() => setPlatform("")} disabled={!platform}>
          All
        </button>
        <button
          onClick={() => setPlatform("web")}
          disabled={platform === "web"}
        >
          Web
        </button>
        <button
          onClick={() => setPlatform("mobile")}
          disabled={platform === "mobile"}
        >
          Mobile
        </button>
      </div>

      <p>
        <strong>Try changing the platform to see different content.</strong>
      </p>

      <h2>Products</h2>

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name}
            {product.promo && <strong> - {product.promo}</strong>}
          </li>
        ))}
      </ul>
    </div>
  );
}
