import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export default function SSR({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) {
  return (
    <main>
      <h1>SSR with Next.js</h1>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<{}> = async ({}) => {
  return {
    props: {},
  };
};
