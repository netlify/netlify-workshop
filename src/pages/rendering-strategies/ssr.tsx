import { GetServerSideProps } from "next";
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

export default function SSR({ posts }: { posts: Post[] }) {
  return (
    <>
      <Nav title="Server-side rendering with Next.js" />
      <main>
        <div className="page-header">
          <h1>Server-Side Rendering</h1>
          <p>Data fetched fresh on each request</p>
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

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch("https://dummyjson.com/posts?limit=10");
  const data = await res.json();
  const posts = data.posts;
  console.log(`Fetched ${posts.length} dummy blog posts at request-time`);

  return {
    props: {
      posts,
    },
  };
};
