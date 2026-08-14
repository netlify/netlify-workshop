import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState } from "react";
import Link from "next/link";

import Nav from "~/components/Nav";

const CACHE_TAG = "scheduled-revalidation";

export default function ScheduledRevalidation({
  generatedAt,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isPurging, setIsPurging] = useState(false);
  const [finishedPurging, setFinishedPurging] = useState(false);
  const [error, setError] = useState(false);

  const purgeCache = async () => {
    setIsPurging(true);
    setError(false);
    const response = await fetch(`/api/purge-cache?tag=${CACHE_TAG}`);
    setIsPurging(false);
    if (response.ok) {
      setFinishedPurging(true);
    } else {
      console.error("Failed to purge cache");
      setError(true);
    }
  };

  return (
    <>
      <Nav title="Scheduled Revalidation" />
      <main>
        <div className="page-header">
          <h1>Scheduled Revalidation</h1>
          <p>Cached forever at the edge, expired once a day on a schedule</p>
        </div>

        <section className="info-box">
          <h2>Cache Configuration</h2>
          <p>
            <code>
              Netlify-CDN-Cache-Control: public, s-maxage=31536000,
              must-revalidate
            </code>
          </p>
          <p>
            <code>Cache-Tag: {CACHE_TAG}</code>
          </p>
          <p>
            <code>schedule: &quot;@daily&quot;</code>
          </p>
        </section>

        <section>
          <div className="data-label">This page was generated at</div>
          <div className="data-value">
            <time dateTime={generatedAt}>{generatedAt}</time>
          </div>
        </section>

        <section>
          <h2>How It Works</h2>
          <p>
            The timestamp above only changes once a day, even though this page
            is server-rendered on every cache miss.
          </p>
          <ol>
            <li>
              The response is cached on Netlify&apos;s CDN for a year and tagged
              with <code>{CACHE_TAG}</code>, so every visitor is served the same
              cached HTML.
            </li>
            <li>
              A{" "}
              <Link href="https://docs.netlify.com/build/functions/scheduled-functions/">
                Scheduled Function
              </Link>{" "}
              runs <code>@daily</code> (midnight UTC) and purges that cache tag
              — exactly what the on-demand endpoint below does, just on a timer.
            </li>
            <li>
              The next request after the purge misses the cache, re-renders the
              page with a fresh timestamp, and is cached again until tomorrow.
            </li>
          </ol>
          <p>
            Because the schedule owns expiry, the cache lifetime is a decision
            made server-side rather than a TTL every visitor races against.
            Scheduled functions only run on published production deploys, so on
            a deploy preview the timestamp changes only when you purge manually.
          </p>
        </section>

        <hr />

        <section>
          <h2>Don&apos;t want to wait until midnight?</h2>
          <p>
            Purging the same cache tag on demand does exactly what the schedule
            does, just sooner.
          </p>
          <button onClick={purgeCache} disabled={isPurging}>
            {isPurging ? "Purging..." : `Purge cache by tag: ${CACHE_TAG}`}
          </button>

          {finishedPurging && (
            <div className="result">
              <p className="status status-success">
                Purged successfully. Refresh to see the updated timestamp.
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

export const getServerSideProps: GetServerSideProps<{
  generatedAt: string;
}> = async ({ res }) => {
  // Cache indefinitely on the CDN; the scheduled function decides when it expires.
  res.setHeader(
    "Netlify-CDN-Cache-Control",
    "public, s-maxage=31536000, must-revalidate",
  );
  res.setHeader("Cache-Tag", CACHE_TAG);

  return {
    props: {
      generatedAt: new Date().toISOString(),
    },
  };
};
