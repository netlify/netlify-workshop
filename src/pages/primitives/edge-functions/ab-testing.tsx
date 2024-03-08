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
    <main>
      <Nav title="A/B testing" />
      <section>
        <h1>Edge Functions: A/B testing</h1>
        <p>
          👋 Hello, would you like some{" "}
          {bucket === "A" ? (
            <strong style={{ color: "green" }}>apples? 🍏🍎🍏</strong>
          ) : (
            <strong style={{ color: "blue" }}>blueberries? 🫐🫐🫐</strong>
          )}
        </p>
      </section>
    </main>
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
