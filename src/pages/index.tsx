import Link from "next/link";

import Nav from "~/components/Nav";

export default function Index() {
  return (
    <>
      <Nav title="Netlify Workshop" />
      <main>
        <div className="page-header">
          <h1>Netlify Workshop</h1>
          <p>Explore rendering strategies and platform primitives</p>
        </div>

        <div className="columns">
          <div>
            <div className="nav-section">
              <h2>Rendering Strategies</h2>
              <ul>
                <li>
                  <Link href="/rendering-strategies/ssg">
                    Static Site Generation (SSG)
                  </Link>
                </li>
                <li>
                  <Link href="/rendering-strategies/ssr">
                    Server-Side Rendering (SSR)
                  </Link>
                </li>
                <li>
                  <Link href="/rendering-strategies/swr">
                    Stale-While-Revalidate (SWR)
                  </Link>
                </li>
                <li>
                  <Link href="/rendering-strategies/odr">
                    On-Demand Revalidation (ODR)
                  </Link>
                </li>
                <li>
                  <Link href="/rendering-strategies/scheduled-revalidation">
                    Scheduled Revalidation
                  </Link>
                </li>
              </ul>
            </div>

            <div className="nav-section">
              <h2>Redirects & Rewrites</h2>
              <ul>
                <li>
                  <Link href="/redirect-example">Redirect Example</Link>
                </li>
                <li>
                  <Link href="/preview-image">Rewrite Example</Link>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <div className="nav-section">
              <h2>Core Primitives</h2>

              <h3>Functions</h3>
              <ul>
                <li>
                  <Link href="/primitives/functions/proxy">Proxy to APIs</Link>
                </li>
                <li>
                  <Link href="/primitives/functions/combine-and-filter">
                    Combine & Filter Responses
                  </Link>
                </li>
                <li>
                  <Link href="/primitives/functions/streams">Streams</Link>
                </li>
                <li>
                  <Link href="/primitives/functions/scheduled-functions">
                    Scheduled Functions
                  </Link>
                </li>
              </ul>

              <h3>Edge Functions</h3>
              <ul>
                <li>
                  <Link href="/primitives/edge-functions/ab-testing">
                    A/B Testing
                  </Link>
                </li>
                <li>
                  <Link href="/primitives/edge-functions/geolocation">
                    Geolocation
                  </Link>
                </li>
              </ul>

              <h3>Blobs</h3>
              <ul>
                <li>
                  <Link href="/primitives/blobs/blobs">Blob Storage</Link>
                </li>
              </ul>

              <h3>Image CDN</h3>
              <ul>
                <li>
                  <Link href="/primitives/image-cdn/same-origin">
                    Same-Origin Images
                  </Link>
                </li>
                <li>
                  <Link href="/primitives/image-cdn/remote">Remote Images</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr />
        <Link
          className="footer-link"
          href="https://github.com/netlify/netlify-workshop/"
        >
          View source on GitHub
        </Link>
      </main>
    </>
  );
}
