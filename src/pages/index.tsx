import Link from "next/link";

export default function Index() {
  return (
    <main>
      <h1>Netlify workshop</h1>
      <h2>Core primitives examples</h2>
      <ul>
        <li>
          <Link href="/primitives/functions">Functions</Link>
        </li>
        <li>
          <Link href="/primitives/edge-functions">Edge Functions</Link>
        </li>
        <li>
          <Link href="/primitives/scheduled-functions">
            Scheduled Functions
          </Link>
        </li>
        <li>
          <Link href="/primitives/background-functions">
            Background Functions
          </Link>
        </li>
        <li>
          <Link href="/primitives/blobs">Blobs</Link>
        </li>
        <li>
          <Link href="/primitives/image-cdn">Image CDN</Link>
        </li>
      </ul>
      <h2>Rendering strategies</h2>
      <ul>
        <li>
          <Link href="/rendering-strategies/ssr">
            Server-side rendering (SSR)
          </Link>
        </li>
        <li>
          <Link href="/rendering-strategies/swr">
            Stale-while-revalidate (SWR)
          </Link>
        </li>
        <li>
          <Link href="/rendering-strategies/isr">
            Incremental Static Regeneration (ISR)
          </Link>
        </li>
      </ul>
    </main>
  );
}
