import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { posts as postsData } from '../data/posts';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

const Post = () => {
  const { postId } = useParams();
  const post = useMemo(
    () => postsData.find((entry) => entry.id === postId),
    [postId]
  );

  if (!post) {
    return (
      <div className="post-detail not-found">
        <Link to="/posts" className="text-link back-link">
          ← Back to posts
        </Link>
        <h1>We couldn&apos;t find that story</h1>
        <p>
          The link may be outdated or the post has been archived. Browse the latest insights instead.
        </p>
        <Link to="/posts" className="primary-button">
          View all posts
        </Link>
      </div>
    );
  }

  const formattedDate = dateFormatter.format(new Date(post.createdAt));

  return (
    <article className="post-detail">
      <Link to="/posts" className="text-link back-link">
        ← Back to posts
      </Link>
      <div className="post-detail-header">
        <div className="post-detail-meta">
          <span className="tag">{post.topic}</span>
          <span>
            <time dateTime={post.createdAt}>{formattedDate}</time> • {post.readTime}
          </span>
        </div>
        <h1>{post.title}</h1>
        <p className="post-detail-hero-copy">{post.heroCopy}</p>
        <p className="post-detail-byline">By {post.author}</p>
      </div>

      <div className="post-detail-content">
        {post.content.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
};

export default Post;
