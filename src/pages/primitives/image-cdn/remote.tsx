import Nav from "~/components/Nav";
const GH_USERS = ["jasonbarry", "bridgpal", "dashedstripes", "rsedighi"];

export default function Remote() {
  return (
    <main>
      <Nav title="Remote images" />
      <section>
        <h1>Remote image on Netlify CDN</h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 40,
          }}
        >
          {GH_USERS.map((user) => (
            <img
              key={user}
              loading="lazy"
              src={`/.netlify/images/?url=https://github.com/${user}.png`}
              style={{ borderRadius: 100 }}
              width="200"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
