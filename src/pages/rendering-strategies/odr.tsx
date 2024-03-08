import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState } from "react";

import Nav from "~/components/Nav";

export default function Index({
  time,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isPurging, setIsPurging] = useState(false);
  const [finishedPurging, setFinishedPurging] = useState(false);

  const purgeCache = async () => {
    setIsPurging(true);
    const response = await fetch("/.netlify/functions/purge-cache-tag?tag=odr");
    if (response.ok) {
      setIsPurging(false);
      setFinishedPurging(true);
    }
  }

  return (
    <main>
      <Nav title="On Demand Revalidation" />
      <h1>On Demand Revalidation</h1>
      <p>This page contains the following cache headers:</p>
      <code>Cache-Control: public, max-age=604800</code>
      <br/>
      <code>Cache-Tag: odr</code>
      <p>This page was last revalidated:</p>
      <time dateTime={time}>{time}</time>

      <br/><br/>
      <hr/>
      <br/>

      <div>
        <button onClick={purgeCache}>{isPurging ? "Purging..." : "Purge this page by cache tag: [odr]"}</button>
      </div>

      {finishedPurging && (
        <div style={{ padding: '2rem', backgroundColor: "#29753d", borderRadius: "6px", textAlign: "center", marginTop: "1rem"}}>
          <p>Purged! Refresh the page to see the updated revalidation time!</p>
        </div>
      )}
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<{ time: string }> = async ({
  res,
}) => {
  res.setHeader(
    "Cache-Control",
    "public, max-age=604800",
  );

  res.setHeader(
    'Cache-Tag',
    'odr'
  );

  return {
    props: {
      time: new Date().toISOString(),
    },
  };
};
