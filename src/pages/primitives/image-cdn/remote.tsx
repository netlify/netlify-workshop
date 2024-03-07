import Nav from "~/components/Nav";
const GH_USERS = [
  "jasonbarry",
  "bridgpal",
  "dashedstripes",
  "rsedighi"
];

export default function Remote() {
  return (
    <main>
      <Nav title="Proxy API requests" />
      <section>
        <h1>Remote image on Netlify CDN</h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 8,
          }}
        >
          {GH_USERS.map((user) => (
            <img
              key={user}
              loading="lazy"
              src={`/.netlify/images/?url=https://github.com/${user}.png`}
              width="400"
              height="250"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
