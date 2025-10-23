import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchPosts } from '../api/posts';
import { handleApiError } from '../api/client';

const fallbackHero = {
  category: 'AI STRATEGY',
  title: 'Designing an AI-native publishing stack',
  excerpt:
    'Discover how modern teams productionize AI safely - from data pipelines to guardrails and continuous evaluation.',
  cta: 'Explore playbook',
  link: '/posts',
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

  const heroPost = posts[0];
  const heroCategory = heroPost?.topic ?? fallbackHero.category;
  const heroTitle = heroPost?.title ?? fallbackHero.title;
  const heroExcerpt = heroPost?.excerpt ?? fallbackHero.excerpt;
  const heroLink = heroPost ? `/posts/${heroPost.slug || heroPost._id}` : fallbackHero.link;
  const heroCta = heroPost ? 'Read insight' : fallbackHero.cta;

  const latestPosts = useMemo(() => posts.slice(0, 3), [posts]);

  return (
    <div className="home-page">
      <section className="hero-card">
        <div className="hero-content">
          <span className="hero-badge">AI</span>
          <p className="hero-category">{heroCategory}</p>
          <h1>{heroTitle}</h1>
          <p className="hero-excerpt">{heroExcerpt}</p>
          <Link className="primary-button" to={heroLink}>
            {heroCta}
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

      <footer className="site-footer">
        <div className="footer-brand">
          <p className="brand-name">@ Jiayi Wang</p>
          <p>
            Donec nec ante nibh. Vestibulum tincidunt lectus sed magna fringilla sagittis. Nulla
            facilisi.
          </p>
          <p className="legal">© 2025 Jiayi Wang. All rights reserved.</p>
        </div>

        <div className="footer-columns">
          <div>
            <h4>Tags</h4>
            <ul className="tag-cloud">
              {['Model Ops', 'Edge AI', 'Safety', 'Agents', 'Data Quality', 'Research'].map((tag) => (
                <li key={tag}>
                  <Link to="/posts">{tag}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Social</h4>
            <ul>
              {['Twitter', 'Facebook', 'Instagram', 'YouTube'].map((item) => (
                <li key={item}>
                  <Link to="/">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>About</h4>
            <ul>
              <li>
                <Link to="/">Shop</Link>
              </li>
              <li>
                <Link to="/">Authors</Link>
              </li>
              <li>
                <Link to="/">Sitemap</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="scroll-top">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
          >
            ↑
          </button>
        </div>
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
