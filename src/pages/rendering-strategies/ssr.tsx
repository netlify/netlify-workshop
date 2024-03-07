import { GetServerSideProps } from "next";

import Nav from "~/components/Nav";

export default function SSR() {
  return (
    <main>
      <Nav title="Server-side rendering" />
      <h1>SSR with Next.js</h1>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
