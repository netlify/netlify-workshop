import { useState } from "react";

import Nav from "~/components/Nav";

export default function Streams() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getStreamResponse = async () => {
    setError(false);
    setLoading(true);
    setResponse("");
    const response = await fetch("/api/stream");

    const reader = response?.body?.getReader();

    if (!reader) {
      console.error("No reader available");
      setError(true);
      setLoading(false);
      return;
    }

    const decoder = new TextDecoder();
    let result = "";
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value);
      setResponse(result);
    }

    setLoading(false);
  };

  return (
    <>
      <Nav title="Streaming Function Responses" />
      <main>
        <div className="page-header">
          <h1>Streaming Responses</h1>
          <p>Stream data from serverless functions in real-time</p>
        </div>

        <section>
          <button onClick={getStreamResponse} disabled={loading}>
            {loading ? "Streaming..." : "Start stream"}
          </button>

          {error && (
            <div className="result">
              <p className="status status-error">
                An error occurred while streaming.
              </p>
            </div>
          )}

          {response && (
            <div className="result">
              <div dangerouslySetInnerHTML={{ __html: response }} />
            </div>
          )}
        </section>
      </main>
    </>
  );
}
