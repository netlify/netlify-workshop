import Nav from "~/components/Nav";

type Post = {
  id: string;
  title: string;
  body: string;
};

function Post({ id, title, body }: Post) {
  return (
    <article className="post" id={id}>
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  );
}

export default function SSG({ posts }: { posts: Post[] }) {
  return (
    <>
      <Nav title="Static Site Generation with Next.js" />
      <main>
        <div className="page-header">
          <h1>Static Site Generation</h1>
          <p>Data fetched at build time for optimal performance</p>
        </div>

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
    </>
  );
}

export const getStaticProps = async () => {
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
