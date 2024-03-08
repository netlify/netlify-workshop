import { useEffect, useState } from "react";

import Nav from "~/components/Nav";

export default function Geolocation() {
  const [origin, setOrigin] = useState("");

  const fetchGeolocation = async () => {
    const response = await fetch("/geolocation");
    const json = await response.json();
    setOrigin(json.geo.city);
  };

  useEffect(() => {
    fetchGeolocation();
  }, []);

  return (
    <main>
      <Nav title="Geography from Edge Functions requests" />
      <section>
        <h1>Edge Functions: Geolocation Data</h1>
        <h2>Search for flights</h2>
        <form>
          <label>
            <span>Origin:</span>
            <input
              autoFocus
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="From"
              type="text"
              value={origin}
            />
          </label>
          <label>
            <span>Destination:</span>
            <input placeholder="To" type="text" />
          </label>
          <button style={{ position: "relative", top: 8 }} type="submit">
            Search
          </button>
        </form>
      </section>
    </main>
  );
}
