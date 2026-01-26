import { useState } from "react";

import Nav from "~/components/Nav";

export default function Proxy() {
  const [joke, setJoke] = useState("");

  const handleClick = async () => {
    const response = await fetch("/api/dad-joke");
    const json = await response.json();
    setJoke(json.joke);
  };

  return (
    <>
      <Nav title="Proxy API requests" />
      <main>
        <div className="page-header">
          <h1>Proxy API Requests</h1>
          <p>Use serverless functions to proxy external API calls</p>
        </div>

        <section>
          <button onClick={handleClick}>Tell me a joke</button>
          {joke && (
            <div className="result">
              <p>{joke}</p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
