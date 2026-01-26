import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState } from "react";

import Nav from "~/components/Nav";

export default function ODR({
  time,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isPurging, setIsPurging] = useState(false);
  const [finishedPurging, setFinishedPurging] = useState(false);
  const [error, setError] = useState(false);

  const purgeCache = async () => {
    setIsPurging(true);
    const response = await fetch("/api/purge-cache?tag=odr");
    if (response.ok) {
      setIsPurging(false);
      setFinishedPurging(true);
    } else {
      console.error("Failed to purge cache");
      setIsPurging(false);
      setError(true);
    }
  };

  return (
    <>
      <Nav title="On Demand Revalidation" />
      <main>
        <div className="page-header">
          <h1>On-Demand Revalidation</h1>
          <p>Invalidate cached pages when content changes</p>
        </div>

        <section className="info-box">
          <h2>Cache Configuration</h2>
          <p>
            <code>Cache-Control: public, max-age=604800</code>
          </p>
          <p>
            <code>Cache-Tag: odr</code>
          </p>
        </section>

        <section>
          <div className="data-label">Last Revalidated</div>
          <time dateTime={time}>{time}</time>
        </section>

        <hr />

        <section>
          <button onClick={purgeCache}>
            {isPurging ? "Purging..." : "Purge cache by tag: odr"}
          </button>

          {finishedPurging && (
            <div className="result">
              <p className="status status-success">
                Purged successfully. Refresh to see the updated time.
              </p>
            </div>
          )}

          {error && (
            <div className="result">
              <p className="status status-error">
                Failed to purge cache. Please try again.
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{ time: string }> = async ({
  res,
}) => {
  res.setHeader("Cache-Control", "public, max-age=604800");
  res.setHeader("Cache-Tag", "odr");

  return {
    props: {
      time: new Date().toISOString(),
    },
  };
};
