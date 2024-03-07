import Nav from "../../../components/Nav";

const PHOTOS = [
  "abstract",
  "beach",
  "bridge",
  "city",
  "fence",
  "lake",
  "lodge",
  "mountains",
  "night",
  "palms",
];

export default function SameOrigin() {
  return (
    <main>
      <Nav title="Proxy API requests" />
      <section>
        <h1>Automatic image optimization</h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 8,
          }}
        >
          {PHOTOS.map((photo) => (
            <img
              loading="lazy"
              src={`/.netlify/images/?url=/photos/${photo}.jpg&w=800&h=500&fit=cover`}
              width="400"
              height="250"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
