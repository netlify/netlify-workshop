import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import Nav from "~/components/Nav";

export default function SWR({
  time,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Nav title="Stale-while-revalidate" />
      <main>
        <div className="page-header">
          <h1>Stale-While-Revalidate</h1>
          <p>Serve cached content while updating in the background</p>
        </div>

        <section className="info-box">
          <h2>Cache Headers</h2>
          <code>Cache-Control: public, s-maxage=10, stale-while-revalidate=59</code>
        </section>

        <section>
          <div className="data-label">Last Revalidated</div>
          <time dateTime={time}>{time}</time>
        </section>
      </main>
    </>
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
