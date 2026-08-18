import Nav from "~/components/Nav";

const GH_USERS = ["jasonbarry", "bridgpal", "dashedstripes", "rsedighi"];

export default function Remote() {
  return (
    <>
      <Nav title="Remote images" />
      <main>
        <div className="page-header">
          <h1>Remote Images</h1>
          <p>Optimize external images through the Netlify CDN</p>
        </div>

        <section>
          <div className="avatar-grid">
            {GH_USERS.map((user) => (
              <img
                key={user}
                loading="lazy"
                src={`/.netlify/images/?url=https://github.com/${user}.png`}
                width="200"
                alt={`${user}'s avatar`}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
