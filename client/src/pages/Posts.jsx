import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../api/posts';
import { handleApiError } from '../api/client';
import { useAuth } from '../context/AuthContext';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const Posts = () => {
  const [sortKey, setSortKey] = useState('date');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await fetchPosts({ sort: sortKey });
        if (isMounted) {
          setPosts(data.posts || []);
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
  }, [sortKey]);

  const categories = useMemo(
    () => Array.from(new Set(posts.map((post) => post.topic))).filter(Boolean),
    [posts]
  );

  return (
    <div className="posts-page">
      <section className="posts-hero">
        <div className="hero-copy">
          <p className="eyebrow">Posts</p>
          <h1>Team stories, research, and behind-the-scenes insights</h1>
          <p>
            Explore the latest operational playbooks, editorial experiments, and creator interviews
            from the Modern Blog team.
          </p>
          {categories.length > 0 && (
            <div className="category-chips" role="list">
              {categories.map((category) => (
                <span key={category} role="listitem">
                  {category}
                </span>
              ))}
            </div>
          )}
        </div>
        <aside className="newsletter-card">
          <h2>Meet the editor</h2>
          <p>
            I archive my favourite AI experiments, product learnings, and notes on{' '}
            <a href="https://www.errorplusone.com/" target="_blank" rel="noreferrer">
              errorplusone.com
            </a>
            . Drop by for longer essays and behind-the-scenes breakdowns.
          </p>
          <a href="https://www.errorplusone.com/" target="_blank" rel="noreferrer" className="primary-button">
            Visit personal site
          </a>
          <p className="disclaimer">Fresh essays, projects, and prototypes updated regularly.</p>
        </aside>
      </section>

      <section className="posts-controls">
        <label htmlFor="posts-sort">
          Sort by
          <select
            id="posts-sort"
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value)}
          >
            <option value="date">Newest</option>
            <option value="author">Author (A–Z)</option>
            <option value="topic">Topic (A–Z)</option>
          </select>
        </label>
        {isAuthenticated && (
          <Link to="/posts/new" className="primary-button ghost">
            Write a post
          </Link>
        )}
      </section>

      {loading && (
        <div className="center-card">
          <p>Loading posts...</p>
        </div>
      )}

      {error && (
        <div className="center-card">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="center-card">
          <p>No posts yet - be the first to share what you&apos;re working on.</p>
          {isAuthenticated ? (
            <Link to="/posts/new" className="primary-button">
              Publish now
            </Link>
          ) : (
            <Link to="/signup" className="text-link">
              Create an account to start publishing &rarr;
            </Link>
          )}
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <section className="posts-grid">
          {posts.map((post) => (
            <article key={post._id} className="post-article">
              <div className="post-meta">
                <span className="tag">{post.topic}</span>
                <span className="time">
                  {dateFormatter.format(new Date(post.createdAt))} • {post.readTime}
                </span>
              </div>
              <h2>{post.title}</h2>
              <p className="excerpt">{post.excerpt}</p>
              <p className="byline">By {post.authorName}</p>
              <Link to={`/posts/${post.slug || post._id}`} className="text-link">
                Read more &rarr;
              </Link>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};

export default Posts;
