import { useState } from "react";

import Nav from "~/components/Nav";

export default function Geolocation() {
  const [geo, setGeo] = useState("");

  const handleClick = async () => {
    const response = await fetch("/geolocation");
    const json = await response.json();
    setGeo(JSON.stringify(json));
  };

  return (
    <main>
      <Nav title="Geography from Edge Functions requests" />
      <section>
        <h1>Edge Functions: Geolocation Data</h1>
        <button onClick={handleClick}>Query for my location</button>
        <div>
          {geo}
        </div>

      </section>
    </main>
  );
}
