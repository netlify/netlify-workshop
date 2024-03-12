import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import Nav from "~/components/Nav";

export default function SWR({
  time,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main>
      <Nav title="Stale-while-revalidate" />
      <h1>Stale-while-revalidate</h1>
      <p>This page contains the following cache headers:</p>
      <code>Cache-Control: public, s-maxage=10, stale-while-revalidate=59</code>
      <br />
      <p>This page was last revalidated:</p>
      <time dateTime={time}>{time}</time>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<{ time: string }> = async ({
  res,
}) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59",
  );

  return {
    props: {
      time: new Date().toISOString(),
    },
  };
};
