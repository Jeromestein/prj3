import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchPosts } from '../api/posts';
import { handleApiError } from '../api/client';

const heroContent = {
  badge: 'Community',
  category: 'Open AI Knowledge Base',
  title: 'Share and discover the most useful AI intel',
  excerpt:
    'Modern AI Blog is a community space where anyone can publish bite-sized updates about emerging models, tools, and responsible workflows. Read what practitioners are shipping and add your own findings in minutes.',
  cta: 'Explore posts',
};

const formatDate = (isoDate) =>
  new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await fetchPosts({ sort: 'date' });
        if (!isMounted) {
          return;
        }
        setPosts((data.posts || []).slice(0, 3));
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
  }, []);

  const latestPosts = useMemo(() => posts.slice(0, 3), [posts]);

  return (
    <div className="home-page">
      <section className="hero-card">
        <div className="hero-content">
          <span className="hero-badge">{heroContent.badge}</span>
          <p className="hero-category">{heroContent.category}</p>
          <h1>{heroContent.title}</h1>
          <p className="hero-excerpt">{heroContent.excerpt}</p>
          <Link className="primary-button" to="/posts">
            {heroContent.cta}
          </Link>
        </div>
      </section>

      <section className="post-section">
        <header className="section-header">
          <h2>Latest AI insights</h2>
        </header>

        {loading && (
          <div className="center-card">
            <p>Loading signals...</p>
          </div>
        )}

        {error && !loading && (
          <div className="center-card">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && latestPosts.length === 0 && (
          <div className="center-card">
            <p>No posts yet. Be the first to publish an AI update.</p>
          </div>
        )}

        {!loading && !error && latestPosts.length > 0 && (
          <div className="post-grid">
            {latestPosts.map((article) => (
              <article key={article.id || article._id} className="post-card">
                <div className="post-card__tag">{article.topic}</div>
                <h3>{article.title}</h3>
                <p className="meta">
                  {article.authorName} &bull; {formatDate(article.createdAt)} &bull;{' '}
                  {article.readTime}
                </p>
                <p>{article.excerpt}</p>
                <Link className="text-link" to={`/posts/${article.slug || article.id}`}>
                  Read more &rarr;
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="site-footer site-footer--compact">
        <div className="footer-brand">
          <p className="brand-name">@ Jiayi Wang</p>
          <p>
            Sharing practical AI intel with the community. Publish a post, learn something new.
          </p>
          <p>
            <a href="https://www.errorplusone.com/" target="_blank" rel="noreferrer">
              errorplusone.com
            </a>{' '}
            ·{' '}
            <Link to="/contact">Contact</Link>
            ·{' '}
            <a href="mailto:hello@modernblog.ai">Email</a>
          </p>
          <p className="legal">© 2025 Jiayi Wang. All rights reserved.</p>
        </div>

        <button
          type="button"
          className="scroll-top-button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          ↑
        </button>
      </footer>

      <section className="auth-cta">
        {isAuthenticated ? (
          <p>
            Ready for more? Jump into your{' '}
            <Link className="text-link" to="/dashboard">
              dashboard
            </Link>{' '}
            to manage your account.
          </p>
        ) : (
          <p>
            Join the community to unlock premium guides.{' '}
            <Link className="text-link" to="/signup">
              Create an account
            </Link>{' '}
            or{' '}
            <Link className="text-link" to="/login">
              log in
            </Link>
            .
          </p>
        )}
      </section>
    </div>
  );
};

export default Home;
