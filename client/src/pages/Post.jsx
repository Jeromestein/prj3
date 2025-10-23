import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link, useParams } from 'react-router-dom';
import { fetchPost } from '../api/posts';
import { handleApiError } from '../api/client';
import { useAuth } from '../context/AuthContext';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const Post = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await fetchPost(postId);
        if (isMounted) {
          setPost(data.post || null);
        }
      } catch (err) {
        if (isMounted) {
          setError(handleApiError(err));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [postId]);

  if (loading) {
    return (
      <div className="post-detail">
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-detail not-found">
        <Link to="/posts" className="text-link back-link">
          ← Back to posts
        </Link>
        <h1>{error || "We couldn't find that post"}</h1>
        <p>The link might be outdated or the story has been unpublished. Browse the latest posts.</p>
        <Link to="/posts" className="primary-button">
          View all posts
        </Link>
      </div>
    );
  }

  const formattedDate = post.createdAt ? dateFormatter.format(new Date(post.createdAt)) : '';
  const canEdit = user && post.authorId === user.id;

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
        <p className="post-detail-hero-copy">{post.excerpt}</p>
        <p className="post-detail-byline">By {post.authorName}</p>
        {canEdit && (
          <Link to={`/posts/${post.id}/edit`} className="secondary-button edit-link">
            Edit post
          </Link>
        )}
      </div>

      <div className="post-detail-content markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
};

export default Post;
