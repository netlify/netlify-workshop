import Nav from "~/components/Nav";

type Post = {
  id: string;
  title: string;
  body: string;
};

// Assuming you have a simple component to display posts
function Post({ id, title, body }: Post) {
  return (
    <div id={id}>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

export default function SSG({ posts }: { posts: Post[] }) {
  return (
    <main>
      <Nav title="Static Site Generation with Next.js" />
      <h1>SSG with Next.js</h1>
      <section>
        <h2>Posts</h2>
        {posts.map((post) => (
          <Post
            key={post.id}
            id={post.id}
            title={post.title}
            body={post.body}
          />
        ))}
      </section>
    </main>
  );
}

// Fetch data at build time
export const getStaticProps = async () => {
  // Replace 'https://jsonplaceholder.typicode.com/posts?_limit=10' with any valid API
  const res = await fetch("https://dummyjson.com/posts?limit=10");
  const data = await res.json();
  const posts = data.posts;
  console.log(`Fetched ${posts.length} dummy blog posts at build-time`);

  return {
    props: {
      posts,
    },
  };
};
