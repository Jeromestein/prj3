import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { posts as postsData } from '../data/posts';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const sortComparators = {
  date: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  author: (a, b) => a.author.localeCompare(b.author),
  topic: (a, b) => a.topic.localeCompare(b.topic),
};

const Posts = () => {
  const [sortKey, setSortKey] = useState('date');

  const categories = useMemo(
    () => Array.from(new Set(postsData.map((post) => post.topic))),
    []
  );

  const sortedPosts = useMemo(() => {
    const comparator = sortComparators[sortKey] ?? sortComparators.date;
    return [...postsData].sort(comparator);
  }, [sortKey]);

  return (
    <div className="posts-page">
      <section className="posts-hero">
        <div className="hero-copy">
          <p className="eyebrow">Posts</p>
          <h1>Ideas, research, and field notes from the Modern Blog team</h1>
          <p>
            Explore deep dives on publishing workflows, behind-the-scenes strategy breakdowns, and
            interviews with creators building tomorrow&apos;s media brands.
          </p>
          <div className="category-chips" role="list">
            {categories.map((category) => (
              <span key={category} role="listitem">
                {category}
              </span>
            ))}
          </div>
        </div>
        <aside className="newsletter-card">
          <h2>Stay in the loop</h2>
          <p>
            Get the latest stories and templates every other Tuesday. Zero fluff, all practical
            insights.
          </p>
          <Link to="/signup" className="primary-button">
            Join newsletter
          </Link>
          <p className="disclaimer">By joining, you agree to receive updates from Modern Blog.</p>
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
      </section>

      <section className="posts-grid">
        {sortedPosts.map((post) => (
          <article key={post.id} className="post-article">
            <div className="post-meta">
              <span className="tag">{post.topic}</span>
              <span>
                {dateFormatter.format(new Date(post.createdAt))} • {post.readTime}
              </span>
            </div>
            <h2>{post.title}</h2>
            <p className="excerpt">{post.excerpt}</p>
            <p className="byline">By {post.author}</p>
            <Link to={`/posts/${post.id}`} className="text-link">
              Read story →
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Posts;
