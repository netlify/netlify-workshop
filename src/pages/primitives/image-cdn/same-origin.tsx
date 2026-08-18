import Nav from "~/components/Nav";

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
    <>
      <Nav title="Same-origin images" />
      <main>
        <div className="page-header">
          <h1>Same-Origin Images</h1>
          <p>Automatic optimization for images hosted on your site</p>
        </div>

        <section>
          <div className="image-grid grid-2">
            {PHOTOS.map((photo) => (
              <img
                key={photo}
                loading="lazy"
                src={`/.netlify/images/?url=/photos/${photo}.jpg&w=800&h=500&fit=cover`}
                width="400"
                height="250"
                alt={photo}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
