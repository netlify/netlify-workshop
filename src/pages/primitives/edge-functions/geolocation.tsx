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
    <>
      <Nav title="Geography from Edge Functions requests" />
      <main>
        <div className="page-header">
          <h1>Geolocation Data</h1>
          <p>Pre-fill forms using location from edge functions</p>
        </div>

        <section>
          <h2>Search for Flights</h2>
          <form className="form-inline">
            <label>
              <span>Origin</span>
              <input
                autoFocus
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="From"
                type="text"
                value={origin}
              />
            </label>
            <label>
              <span>Destination</span>
              <input placeholder="To" type="text" />
            </label>
            <button type="submit">Search</button>
          </form>
        </section>
      </main>
    </>
  );
}
