import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";

import Nav from "~/components/Nav";

export default function Index({
  time,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const purgeCache = async () => {
    const response = await fetch("/.netlify/functions/purge-cache-tag?tag=odr");
    if (response.ok) {
      console.log("Purged!");
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
        <button onClick={purgeCache}>Purge this page by cache tag: [odr]</button>
      </div>
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
