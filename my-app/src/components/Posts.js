export default function PostsList({posts}) {
    return (
        <div>
          {posts.map(post => (
            <div>
              <h2>{ post.title }</h2>
              <p>{ post.body }</p>
            </div>
          ))}
        </div>
    );
}