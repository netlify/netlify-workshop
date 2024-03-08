import { useState } from "react";

import Nav from "~/components/Nav";

export default function Proxy() {

  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const getStreamResponse = async () => {
    setLoading(true);
    const response = await fetch("/.netlify/functions/stream");
    
    const reader = response?.body?.getReader();

    if (!reader) {
      console.error("No reader available");
      return;
    }

    const decoder = new TextDecoder();
    let result = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value);
      setResponse(result);
    }

    setLoading(false);
  }
  

  return (
    <main>
      <Nav title="Streaming Function Responses" />
      <section>
        <button onClick={getStreamResponse}>{!loading ? "Get a streaming response" : "Fetching response..."}</button>
        {error && <p>{error}</p>}
        <div dangerouslySetInnerHTML={{__html: response}}></div>
      </section>
    </main>
  );
}
