# Netlify Core Workshop

In this workshop, you will learn how to create your first composable website with Netlify. You'll learn features of the Netlify platform, and will deep dive into core primitives. 

The site showcasing all workshop examples is available here: [https://netlify-core-workshop.netlify.app](https://netlify-core-workshop.netlify.app)

## What are we going to learn?

In this workshop, you will learn how to:

- Create your first site on Netlify
- Trigger builds with Git and embrace a CI/CD workflow
- Create Deploy Previews and collaborate using the Netlify Drawer
- Securely manage environment variables in the Netlify CLI and UI
- Learn about different caching and page rendering strategies
- Personalize user experiences with Netlify Edge Functions
- Read and write to a globally-distributed data store using Netlify Blobs
- Optimize images on the fly with Netlify Image CDN 

## Let's get started

### Local setup and CI/CD workflow

<details><summary>Part 1: Initial setup</summary>

i. [Log in to Netlify](http://app.netlify.com). If you haven't made an account yet, then [sign up](https://app.netlify.com/signup). 

ii. Install the [Netlify GitHub app](https://github.com/apps/netlify/installations/select_target) on your org or personal GitHub account if you have not done so already.

iii. Deploy this repo to Netlify! Clicking the button below will copy the contents of this repo into a repo that you control, and create a new site that is linked to your new repo. 

DTN BUTTON GO HERE

iv. Clone your new repo, and install dependencies locally.

```bash
git clone <new_repo_url>
cd netlify-workshop
npm i
```

v. Ensure you have the latest version of `netlify-cli` installed globally. Then log in to the CLI, link your repo to your site, and start local dev server

```bash
npm i netlify-cli -g
netlify login
netlify link
netlify dev
```

💡 Learn more about [getting started](https://docs.netlify.com/get-started/) in our docs.

</details>

<details><summary>Part 2: Understanding deploy contexts and CI/CD</summary>

Create a new branch, commit changes, push the branch, and open a pull request.

```bash
git checkout -b feat/bookshelf
git add -A
git commit -m "Adding a list of books to the home page"
git push origin feat/bookshelf
```

You should see a link to the Deploy Preview as a comment by the Netlify bot on the pull request. Pushing to an open pull request [will kick off a new build](https://www.netlify.com/products/build/) in the Continuous Integration pipeline, and you can inspect the deploy logs as the build is building and deploying.

In addition to deploy logs, the Netlify UI gives you access to function logs as well. You can change the region a function executes by changing the region selector in **Site configuration > Build & deploy > Functions**.

In the Deploy Preview itself, you'll notice a floating toolbar anchored to the bottom of your screen. This is the [Netlify Drawer](https://www.netlify.com/products/deploy-previews/). You and your teammates can use this to leave feedback to each other about the Deploy Preview. Any comments you make will sync back to the pull request on GitHub (or any Git service that you may use). 

Back in the pull request, merge to main. This will kick off a production build. Every deploy is [atomic](https://jamstack.org/glossary/atomic/) and [immutable](https://jamstack.org/glossary/immutable/), which makes [instant rollbacks](https://docs.netlify.com/site-deploys/manage-deploys/#rollbacks) a breeze.

In your local repo, sync up with the changes from `main` again: 

```bash
git checkout main
git pull origin main
```

💡 Learn more about [Git workflows](https://docs.netlify.com/git/overview/) and [site deploys](https://docs.netlify.com/site-deploys/overview/) in our docs.

</details>

<details><summary>Part 3: Share environment variables with your team</summary>

You can manage environment variables in the UI and CLI. 

Go to **Site configuration > Environment variables** to add site-specific env vars to your site. 

![Environment variables form](media/env-var-form.png)

In the CLI, enter the following command to create an environment variable that is scoped to the Functions runtime: 

```bash
netlify env:set OPENAI_KEY <YOUR_VALUE> --scope functions
```

💡 Learn more about [environment variables](https://docs.netlify.com/environment-variables/overview/) in our docs.

</details>

### Platform features

<details><summary>Part 1: Getting acquainted with the Netlify UI</summary>

Here, we'll take a quick segue from our CLI and dev environment to showcase more features from the Netlify UI.

- [Log Drains](https://docs.netlify.com/monitor-sites/log-drains/)
- [Analytics](https://docs.netlify.com/monitor-sites/site-analytics/)
- [Real User Metrics](https://docs.netlify.com/monitor-sites/real-user-metrics/)
- [Site protections](https://docs.netlify.com/security/secure-access-to-sites/site-protection/)
- [Slack notifications](https://docs.netlify.com/integrations/slack-app/)

</details>

<details><summary>Part 2: High-level overview of platform primitives</summary>

</details>

### Platform primitives

<details><summary>Part 1: Configuring headers, proxies, and redirects</summary>

You'll notice that when you refresh a page on the `/books/{id}` route, the site 404s. Why is that? Since this frontend stack utilizes React as an SPA (Single Page Application), there is only one single HTML file (`/index.html`) inside of the deploy, and routing is managed exclusively by JavaScript referenced in that file. We'll need to add a [redirect](https://docs.netlify.com/routing/redirects/rewrites-proxies/#history-pushstate-and-single-page-apps) that routes 404s to `/index.html`.

Inside your publish directory (for this repo, `/public`), add a `_redirects` file that contains the following: 

```
/*  /index.html  200
```

For every fallthrough case (i.e. whenever a route is accessed and there isn't a file match), it will now redirect back to `/index.html`, where `react-router` will route accordingly.

Similar to the `_redirects` file is the `_headers` file. Here you can set custom headers for routes of your choosing. Create a `/public/_headers` file, and save the following: 

```
/* 
  X-Frame-Options: SAMEORIGIN
```

This will prevent your site from being loaded in an iframe, a technique that help your site prevent [clickjacking](https://en.wikipedia.org/wiki/Clickjacking) attacks. 

You can also configure both redirects and headers inside the `/netlify.toml` file. Here is the `netlify.toml` equivalents of the above: 

```
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
```

💡 Learn more about [redirects](https://docs.netlify.com/routing/redirects/) and [custom headers](https://docs.netlify.com/routing/headers/) in our docs.

</details>

<details><summary>Part 2: Going serverless with Functions</summary>

Our site is looking a little bare. Let's add some content! First we'll fetch a list of books that we happen to have as a [CSV file saved inside the /public directory](https://github.com/netlify/compose-workshop-2023/blob/main/public/books.csv).

i. Add the `Bookshelf` component to `src/pages/index.tsx`

```diff
+import Bookshelf from '~/components/Bookshelf';
import Footer from '~/components/Footer';
import Hero from '~/components/Hero';

export default function Home() {
  return (
    <section>
      <Hero />
+     <Bookshelf />
      <Footer />
    </section>
  );
}
```

ii. Return data from a CSV in an API response in `netlify/functions/books.ts`

```typescript
import csv from 'csvtojson';

export default async (req: Request) => {
  const { origin } = new URL(req.url);
  const response = await fetch(`${origin}/books.csv`);
  const csvContent = await response.text();
  const books = await csv().fromString(csvContent);
  
  return Response.json(books);
};
```

💡 Invoke your function from the CLI:

```
netlify functions:invoke books
```

iii. Fetch from the function in `src/context/DataProvider.tsx`

```diff
function StoreProvider({ children }: Props) {
- const books = [] as Book[];
+ const [books, setBooks] = useState<Book[]>([]);

  const fetchBooks = async () => {
+   if (!books.length) {
+     const response = await fetch(`/.netlify/functions/books`);
+     const data = await response.json();
+     setBooks(data);
+   }
  };
}
```

That's nice, but we can only return all the books, when sometimes we only want one book at a time. Let's add a custom path with an optional slug in the API route.

iv. Export custom config to control method, route, etc in `netlify/functions/books.ts`

```typescript
export const config: Config = {
  method: 'GET',
  path: '/api/books{/:id}?',
};
```

💡 The `path` parameter follows the [URL Pattern API](https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API) spec.


v. Change your clientside API call to new route in `src/context/DataProvider.tsx`

```diff
-  const fetchBooks = async () => {
-   if (!books.length) {
-     const response = await fetch(`/.netlify/functions/books`);
-     const data = await response.json();
-     setBooks(data);
-   }
-  };
+  const fetchBooks = async (id: string = '') => {
+    if (books.length <= 1) {
+      const response = await fetch(`/api/books/${id}`);
+      const data = await response.json();
+      setBooks(Array.isArray(data) ? data : [data]);
+    }
+  };
```

vi. Extract and log the id from the URL params in `netlify/functions/books.ts`

```diff
-export default async (req: Request) => {
+export default async (req: Request, context: Context) => {
+  const { id } = context.params;
+  console.log(`Looking up ${id || 'all books'}...`);
```

vii. Return a single book if the slug is present before the last return statement

```typescript
if (id) {
  const book = books.find(b => b.id === id);
  if (!book) {
    return new Response('Not found', { status: 404 });
  }
  return Response.json(book);
}
```

💡 Learn more about [Functions](https://docs.netlify.com/functions/overview/) in our docs.

</details>

<details><summary>Part 3: Run middleware and personalize with Edge Functions</summary>

We're going to make a swag section of the site that is personalized to the user based on their geolocation. Edge functions act as middleware for the CDN &mdash; they run in front of other routes!

i. Add the Swag component to the home page in `src/pages/index.tsx`

```diff
import Bookshelf from '~/components/Bookshelf';
import Footer from '~/components/ui/Footer';
import Hero from '~/components/Hero';
+import Swag from '~/components/Swag';

export default function Home() {
  return (
    <section>
      <Hero />
+     <Swag />
      <Bookshelf />
      <Footer />
    </section>
  );
}
```

ii. Fetch the swag in `netlify/context/DataProvider.tsx`

```diff
- const swag = [] as Swag[];
+ const [swag, setSwag] = useState<Swag[]>([]);

  const fetchSwag = async () => {
+    if (!swag.length) {
+      const response = await fetch('/api/swag');
+      const data = await response.json();
+      setSwag(data);
+    }
  };
```

iii. Sort items ascending based on distance to user in `netlify/functions/swag.ts`

```diff
import { Config, Context } from '@netlify/functions'
+import haversine from 'haversine';

-export default async (req: Request) => {
+export default async (req: Request, context: Context) => {
   // ...
+  const hasGeo = context.geo?.latitude && context.geo?.longitude;
-  const items = selectRandomItems(merchandise, ITEMS_COUNT);
+  const items = hasGeo
+    ? merchandise
+        .sort(
+          (a, b) =>
+            haversine(a.location, context.geo) -
+            haversine(b.location, context.geo)
+        )
+        .slice(0, ITEMS_COUNT)
+    : selectRandomItems(merchandise, ITEMS_COUNT);

  return Response.json(items);
};
```

iv. Rewrite response bodies to contain geolocation data in `netlify/edge-functions/geo.ts`

```typescript
import { Config, Context } from '@netlify/edge-functions';

export default async (request: Request, context: Context) => {
  const response = await context.next();
  response.headers.set('x-custom-header', 'invoked');

  // html GETs only
  const isGET = request.method?.toUpperCase() === 'GET';
  const isHTMLResponse = response.headers
    .get('content-type')
    ?.startsWith('text/html');
  if (!isGET || !isHTMLResponse) {
    return response;
  }

  const body = await response.text();
  const transformedBody = body.replace(
    'window.geo = {}',
    `window.geo = ${JSON.stringify(context.geo)}`
  );

  return new Response(transformedBody, response);
};

export const config: Config = {
  path: '/*',
  excludedPath: '/(api|assets|images)/*',
};
```

v. Edge Functions are also great places to add A/B testing. You can add a cookie at the edge to segment user traffic into groups (also known as  buckets) to run experimentation. Set a new cookie in `netlify/edge-functions/abtest.ts`: 

```diff
+ // set the new "ab-test-bucket" cookie
+ context.cookies.set({
+   name: bucketName,
+   value: newBucketValue,
+ });
  
  return response;
```

💡 Learn more about [Edge Functions](https://docs.netlify.com/edge-functions/overview/) in our docs.

</details>

<details><summary>Part 4: Globally persist data with Blobs</summary>

</details>

<details><summary>Part 5: Rendering techniques and caching strategies</summary>

iii. Purge cache of specific tags using an API call

```bash
curl -X POST 'https://api.netlify.com/api/v1/purge' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{"site_id":"$SITE_ID","cache_tags":["books"]}'
```

💡 Learn more about [caching](https://docs.netlify.com/platform/caching/) in our docs.

</details>

<details><summary>Part 6: Optimize images at runtime with Image CDN</summary>

</details>

## Recent Enterprise-focused resources from our blog

Read these recent blog posts focused on Enterprise releases, features,  and use cases.

- Oct 13 2023: [Cache-tags & Purge API](https://www.netlify.com/blog/cache-tags-and-purge-api-on-netlify/)
- Oct 12 2023: [Introducing Netlify Functions 2.0](https://www.netlify.com/blog/introducing-netlify-functions-2-0/)
- Sep 28 2023: [Stale-while-revalidate & fine-grained cache control](https://www.netlify.com/blog/swr-and-fine-grained-cache-control/)
- Sep 13 2023: [General Availability of Netlify Software Development Kit (SDK)](https://www.netlify.com/blog/general-availability-netlify-sdk-software-development-kit/)
- Aug 29 2023: [Elevating enterprise deployment with enhanced monorepo experience](https://www.netlify.com/blog/elevating-enterprise-deployment-introducing-an-enhanced-monorepo-experience-on-netlify/)
- Aug 24 2023: [How I learned to stop worrying and love the Content Security Policy](https://www.netlify.com/blog/general-availability-content-security-policy-csp-nonce-integration/)
- Aug 23 2023: [IP and Geo Restrictions for WAF Security](https://www.netlify.com/blog/general-availability-web-application-firewall-traffic-rules/)
- Aug 22 2023: [Secrets Controller: Proactive security for secret keys](https://www.netlify.com/blog/general-availability-secrets-controller/)
