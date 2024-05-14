import Nav from "~/components/Nav";
const GH_USERS = ["jasonbarry", "bridgpal", "dashedstripes", "rsedighi"];
import Image from "next/image";
export default function Remote() {
  return (
    <main>
      <Nav title="Remote images on Netlify Image CDN" />
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
            <Image
              key={user}
              loading="lazy"
              src={`https://github.com/${user}.png`}
              alt={user}
              style={{ borderRadius: 100 }}
              width="200"
              height="200"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
