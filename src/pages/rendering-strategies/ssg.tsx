import Nav from '~/components/Nav';

// Assuming you have a simple component to display posts
function Post({ title, body }) {
  return (
    <div>
      <h2><a>{title}</a></h2>
      <p>{body}</p>
    </div>
  );
}

export default function SSR({ posts }) {
  return (
    <main>
      <Nav title="Static Site Generation with Next.js" />
      <h1>SSG with Next.js</h1>
      <section>
        <h2>Posts</h2>
        {posts.map(post => (
          <Post key={post.id} id={post.id} title={post.title} body={post.body} />
        ))}
      </section>
    </main>
  );
}

// Fetch data at request time
export const getStaticProps = async () => {
  // Replace 'https://jsonplaceholder.typicode.com/posts?_limit=10' with any valid API
  const res = await fetch('https://dummyjson.com/posts?limit=10');
  const data = await res.json();
  const posts = data.posts;

  return {
    props: {
      posts,
    },
  };
};
