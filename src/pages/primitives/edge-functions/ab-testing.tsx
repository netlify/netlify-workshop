import { GetServerSideProps } from "next";

import Nav from "~/components/Nav";

const parseCookies = (cookieString: string) => {
  const cookies = {} as Record<string, string>;
  if (cookieString) {
    const items = cookieString.split("; ");
    items.forEach((item) => {
      const [name, value] = item.split("=");
      cookies[name] = value;
    });
  }
  return cookies;
};

interface Props {
  bucket: string;
}

export default function ABTesting(props: Props) {
  const { bucket } = props;
  return (
    <>
      <Nav title="A/B testing" />
      <main>
        <div className="page-header">
          <h1>A/B Testing</h1>
          <p>Serve different content based on user bucket assignment</p>
        </div>

        <section className="info-box">
          <p>
            Hello, would you like some{" "}
            {bucket === "A" ? (
              <strong className="variant-a">apples?</strong>
            ) : (
              <strong className="variant-b">blueberries?</strong>
            )}
          </p>
          <p>
            Your bucket: <code>{bucket || "Not assigned"}</code>
          </p>
        </section>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookies = parseCookies(req.headers.cookie || "");
  return {
    props: {
      bucket: cookies["ab-test-bucket"] ?? null,
    },
  };
};
