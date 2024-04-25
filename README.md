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

<details><summary>Part 1: Initial setup</summary><br />

i. [Log in to Netlify](https://app.netlify.com). If you haven't made an account yet, then [sign up](https://app.netlify.com/signup).

ii. Install the [Netlify GitHub app](https://github.com/apps/netlify/installations/select_target) on your org or personal GitHub account if you have not done so already.

iii. Fork workshop project to personal Github account.

iv.  Deploy workshop project to own personal Netlify account 

v. Clone your new repo, and install dependencies locally.

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

<details><summary>Part 2: Understanding deploy contexts and CI/CD</summary><br />

Create a new branch, commit changes, push the branch, and open a pull request.

```bash
git checkout -b testing
git commit -m "Changing some headings to red"
git push origin testing
```

You should see a link to the Deploy Preview as a comment by the Netlify bot on the pull request. Pushing to an open pull request [will kick off a new build](https://www.netlify.com/products/build/) in the Continuous Integration pipeline, and you can inspect the deploy logs as the build is building and deploying.

In the Deploy Preview itself, you'll notice a floating toolbar anchored to the bottom of your screen. This is the [Netlify Drawer](https://www.netlify.com/products/deploy-previews/). You and your teammates can use this to leave feedback to each other about the Deploy Preview. Any comments you make will sync back to the pull request on GitHub (or any Git service that you may use).

Back in the pull request, merge to main. This will kick off a production build. Every deploy is [atomic](https://jamstack.org/glossary/atomic/) and [immutable](https://jamstack.org/glossary/immutable/), which makes [instant rollbacks](https://docs.netlify.com/site-deploys/manage-deploys/#rollbacks) a breeze.

In your local repo, sync up with the changes from `main` again:

```bash
git checkout main
git pull origin main
```

💡 Learn more about [Git workflows](https://docs.netlify.com/git/overview/) and [site deploys](https://docs.netlify.com/site-deploys/overview/) in our docs.

</details>

<details><summary>Part 3: Share environment variables with your team</summary><br />

You can securely manage and share environment variables with your teammates in both the Netlify CLI and UI. Let's start with the CLI.

It's common practice for projects to have a gitignored `.env` file in the root of the repo. This one doesn't, so let's add a dummy one now:

```bash
echo "MY_API_TOKEN=asdf123456789" > .env
```

To share this hypothetically-sensitive value with your team, simply use the `env:import` command:

```bash
netlify env:import .env
```

Now, when you go to **Site configuration > Environment variables** in the Netlify UI, you should see your environment variable that you had saved in your `.env` file. 

You can adjust deploy contexts and scopes in the UI, and in the CLI too. 

💡 Learn more about [environment variables](https://docs.netlify.com/environment-variables/overview/) in our docs.

</details>

### Platform features

<details><summary>Part 1: Getting acquainted with the Netlify UI</summary><br />

Here, we'll take a quick segue from our CLI and dev environment to showcase more features from the Netlify UI.

- [Deploy logs](https://docs.netlify.com/site-deploys/overview/#deploy-log)
- [Log Drains](https://docs.netlify.com/monitor-sites/log-drains/)
- [Analytics](https://docs.netlify.com/monitor-sites/site-analytics/)
- [Real User Metrics](https://docs.netlify.com/monitor-sites/real-user-metrics/)
- [Site protections](https://docs.netlify.com/security/secure-access-to-sites/site-protection/)
- [Slack notifications](https://docs.netlify.com/integrations/slack-app/)

</details>

<details><summary>Part 2: High-level overview of platform primitives</summary><br />

These are the primitives that we'll be talking more about in Day 2 of this workshop. It's useful to understand their benefits and how they compare to one another. 

- **Functions**
  - Built on AWS Lambda
  - Runs in a single region (this is configurable)
  - 10s execution time (can be extended up to 26s)
  - 50MB bundle size max, 6MB payload size max
  - Supports streaming
- **Edge Functions**
  - Built on Deno Deploy
  - Runs on the edge, geographically close to user
  - Must respond with headers within 40s
  - 20MB bundle size max
  - Supports streaming
- **Blobs**
  - Built on AWS S3
  - Ubiquitously available in build, functions, edge functions
  - Optimized for frequent reads / infrequent writes
  - Supports CRUD operations
  - Deploy-specific stores
- **Image CDN**
  - Built on Imgix
  - Dynamically optimize and cache images at request-time

Netlify offers more primitives than this -- for example, you can create serverless cron jobs with [Scheduled Functions](https://docs.netlify.com/functions/scheduled-functions/), and run long-running tasks with [Background Functions](https://docs.netlify.com/functions/background-functions/)! But we won't dive into those topics during this workshop. 

</details>

### Platform primitives

<details><summary>Part 1: Configuring headers, proxies, and redirects</summary><br />

You can configure many aspects of your site in code with the [netlify.toml](https://docs.netlify.com/configure-builds/file-based-configuration/#sample-netlify-toml-file) file. 

Similar to the `_redirects` file is the `_headers` file. Here you can set custom headers for routes of your choosing. Inside the `/public/_headers` file, and save the following:

```
/*
  X-Frame-Options: deny
```

This will prevent your site from being loaded in an iframe, a technique that help your site prevent [clickjacking](https://en.wikipedia.org/wiki/Clickjacking) attacks.

You can also configure both redirects and headers inside the `/netlify.toml` file. Here is the `netlify.toml` equivalents of the above:

```
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "deny"
```

💡 Learn more about [redirects and rewrites](https://docs.netlify.com/routing/redirects/) and [custom headers](https://docs.netlify.com/routing/headers/) in our docs.

</details>

<details><summary>Part 2: Rendering techniques and caching strategies</summary><br />

**🧑‍💻 Relevant demo and code:**

- [Static site generation (SSG)](https://netlify-core-workshop.netlify.app/rendering-strategies/ssg) ([src/pages/rendering-strategies/ssg.tsx](https://github.com/netlify/netlify-workshop/blob/main/src/pages/rendering-strategies/ssg.tsx))
- [Server-side rendering (SSR)](https://netlify-core-workshop.netlify.app/rendering-strategies/ssr) ([src/pages/rendering-strategies/ssr.tsx](https://github.com/netlify/netlify-workshop/blob/main/src/pages/rendering-strategies/ssr.tsx))
- [Stale-while-revalidate (SWR)](https://netlify-core-workshop.netlify.app/rendering-strategies/swr) ([src/pages/rendering-strategies/swr.tsx](https://github.com/netlify/netlify-workshop/blob/main/src/pages/rendering-strategies/swr.tsx))
- [On-demand revalidation (ODR)](https://netlify-core-workshop.netlify.app/rendering-strategies/odr) ([src/pages/rendering-strategies/odr.tsx](https://github.com/netlify/netlify-workshop/blob/main/src/pages/rendering-strategies/odr.tsx))

💡 Learn more about [caching](https://docs.netlify.com/platform/caching/) in our docs.

</details>

<details><summary>Part 3: Going serverless with Functions</summary><br />

**🧑‍💻 Relevant demo and code:**

- [Proxy to APIs](https://netlify-core-workshop.netlify.app/primitives/functions/proxy) ([netlify/functions/dad-joke.ts](https://github.com/netlify/netlify-workshop/blob/main/netlify/functions/dad-joke.ts))
- [Combine and filter APIs](https://netlify-core-workshop.netlify.app/primitives/functions/combine-and-filter) ([netlify/functions/platform-specific.ts](https://github.com/netlify/netlify-workshop/blob/main/netlify/functions/platform-specific.ts))
- [Streaming APIs](https://netlify-core-workshop.netlify.app/primitives/functions/streams) ([netlify/functions/stream.ts](https://github.com/netlify/netlify-workshop/blob/main/netlify/functions/stream.ts))

Serverless functions open a world of possibilities for running on-demand, server-side code without having to run a dedicated server. 

With Netlify Functions, your serverless functions are version-controlled, built, and deployed along with the rest of your Netlify site, and we will automatically handle service discovery through our built-in API gateway. This eliminates overhead and brings the power of Deploy Previews and rollbacks to your functions.

By default, any JavaScript/TypeScript file in a site's `netlify/functions` directory will become a Function available at the `/.netlify/functions/{filename}` route. A simple Hello World would look like this: 

```ts
// netlify/functions/hello-world.js
export default async () => {
  return new Response("Hello world!");
};
```

Once deployed, you can visit `/.netlify/functions/hello-world` to invoke your Function in production.

💡 Learn more about [Functions](https://docs.netlify.com/functions/overview/) in our docs.

</details>

<details><summary>Part 4: Run middleware and personalize with Edge Functions</summary><br />

**🧑‍💻 Relevant demo and code:**

- [A/B testing](https://netlify-core-workshop.netlify.app/primitives/edge-functions/ab-testing) ([netlify/edge-functions/abtest.ts](https://github.com/netlify/netlify-workshop/blob/main/netlify/edge-functions/abtest.ts))
- [Geolocation](https://netlify-core-workshop.netlify.app/primitives/edge-functions/geolocation) ([netlify/edge-functions/get-geo.ts](https://github.com/netlify/netlify-workshop/blob/main/netlify/edge-functions/get-geo.ts))

Edge functions are like Functions, but they execute closer to where your users are. While you can reach them as you would an endpoint, they can also chain in front of any route on your site. Think of them like middleware for the CDN: they can add HTTP headers and transform responses, passing along the next request, before ultimately reaching your users. 

All this dynamic processing happens in a secure runtime based on Deno directly from the worldwide network edge location closest to each user for fast response times. Plus, you have the option to cache edge function responses for even faster response times. Edge functions are version-controlled, built, and deployed along with the rest of your site. This eliminates overhead and brings the power of Deploy Previews and rollbacks to your edge functions.

💡 Learn more about [Edge Functions](https://docs.netlify.com/edge-functions/overview/) in our docs.

</details>

<details><summary>Part 5: Globally persist data with Blobs</summary><br />

**🧑‍💻 Relevant demo and code:**

- [Access blob storage](https://netlify-core-workshop.netlify.app/primitives/functions/blobs) ([netlify/functions/blob.ts](https://github.com/netlify/netlify-workshop/blob/main/netlify/functions/blob.ts))

Netlify Blobs is a highly-available S3-like data store optimized for frequent reads and infrequent writes. Provisioning, configuration, and access control is handled automatically. This integrated zero-configuration solution helps you focus on building business value in your project rather than toil on setting up and scaling a separate blob storage solution. 

With Blobs, you can store and retrieve unstructured data extremely easily. Blobs are ubiquitous: you can access them in the build, in functions, and in edge functions. 

```ts
import { getStore } from "@netlify/blobs";

export default async (req: Request) => {
  const store = getStore("ntl-workshop-todos");

  if (req.method === "GET") {
    const todos = await store.get("todos", { type: "json" });
    return Response.json(todos || JSON.stringify([]), { status: 200 });
  }

  if (req.method === "PUT") {
    const body = await req.json();
    await store.setJSON("todos", body);
    return new Response("Todos updated", { status: 200 });
  }
};
```

💡 Learn more about [Netlify Blobs](https://docs.netlify.com/blobs/overview/) in our docs.

</details>

<details><summary>Part 6: Optimize images at runtime with Image CDN</summary><br />

**🧑‍💻 Relevant demo and code:**

- [Same-origin images](https://netlify-core-workshop.netlify.app/primitives/image-cdn/same-origin) ([src/pages/primitives/image-cdn/same-origin.tsx](https://github.com/netlify/netlify-workshop/blob/main/src/pages/primitives/image-cdn/same-origin.tsx))
- [Remote images](https://netlify-core-workshop.netlify.app/primitives/image-cdn/remote) ([src/pages/primitives/image-cdn/remote.tsx](https://github.com/netlify/netlify-workshop/blob/main/src/pages/primitives/image-cdn/remote.tsx))

You may have experienced pain points in the past dealing with image optimizations for the web. Do you keep raw source images in a repo, and run them through `sharp` or `image-magick` at during the build? That would increase build time and costs significantly. Either way, you'd still need to deal with various image formats, sizing, pixel density, `srcset` attributes, etc. 

With Netlify Image CDN, you can transform images on demand without impacting build times. Image CDN also handles content negotiation to use the most efficient image format for the requesting client. Optimizing the size and format of your images improves both the runtime performance and reliability of your site. Transformations are integrated natively into the CDN so that repeated requests leverage layers of caching for improved performance.

To use Netlify Image CDN, simply prefix your image URLs with `/.netlify/images?url=`: 

```diff
- <img src="/owl.jpeg" />
+ <img src="/.netlify/images?url=/owl.jpeg" />
```

The next time you request that image, you'll see the format be converted on-the-fly to a more optimal compression format that your browser supports. There's no need to pre-generate images of different formats, or stuff multiple URLs in a `srcset` attribute -- it's all handled at request-time, and cached on Netlify's CDN. 

You can configure many other aspects of the image, such as size, fit, position, format, and quality, by passing in [additional query parameters](https://docs.netlify.com/image-cdn/overview/#transform-images).

💡 Learn more about [Image CDN](https://docs.netlify.com/image-cdn/overview/) in our docs.

</details>

## Recent Enterprise-focused resources from our blog

Read these recent blog posts focused on Enterprise releases, features, and use cases.

- [Netlify + AI: Why’d my deploy fail?](https://www.netlify.com/blog/netlify-ai-why-did-my-deploy-fail/)
- [Full control over caching with cache ID](https://www.netlify.com/blog/full-control-over-caching-with-cache-id/)
- [Introducing Netlify Image CDN Beta](https://www.netlify.com/blog/introducing-netlify-image-cdn-beta/)
- [Introducing Netlify Blobs Beta](https://www.netlify.com/blog/introducing-netlify-blobs-beta/)
- [Cache-tags & Purge API](https://www.netlify.com/blog/cache-tags-and-purge-api-on-netlify/)
- [Introducing Netlify Functions 2.0](https://www.netlify.com/blog/introducing-netlify-functions-2-0/)
- [Stale-while-revalidate & fine-grained cache control](https://www.netlify.com/blog/swr-and-fine-grained-cache-control/)
- [Elevating enterprise deployment with enhanced monorepo experience](https://www.netlify.com/blog/elevating-enterprise-deployment-introducing-an-enhanced-monorepo-experience-on-netlify/)
- [How I learned to stop worrying and love the Content Security Policy](https://www.netlify.com/blog/general-availability-content-security-policy-csp-nonce-integration/)
- [IP and Geo Restrictions for WAF Security](https://www.netlify.com/blog/general-availability-web-application-firewall-traffic-rules/)
- [Secrets Controller: Proactive security for secret keys](https://www.netlify.com/blog/general-availability-secrets-controller/)
