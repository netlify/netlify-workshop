import { useState } from "react";

import Nav from "../../../components/Nav";

export default function Proxy() {
  const [joke, setJoke] = useState("");

  const handleClick = async () => {
    const response = await fetch("/api/dad-joke");
    const json = await response.json();
    setJoke(json.joke);
  };

  return (
    <main>
      <Nav title="Proxy API requests" />
      <section>
        <h1>Functions: Proxy API requests</h1>
        <button onClick={handleClick}>Tell me a joke</button>
        <p>{joke}</p>
      </section>
    </main>
  );
}
