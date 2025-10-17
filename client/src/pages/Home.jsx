import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const featuredPost = {
  title: '10 Tips for Designing a Professional Wireframe',
  category: 'Design',
  excerpt:
    'Modern wireframes balance clarity and speed. Explore practical guidelines to help your next concept session ship faster.',
  cta: 'Read more',
};

const articles = [
  {
    imageUrl: '/images/placeholder-1.jpg',
    title: 'How to Overcome Creative Blocks & Find Inspiration',
    author: 'Anna Maria Lopez',
    date: 'Mar 15, 2022',
    readTime: '8 min read',
    excerpt:
      'Stagnant brief? Try these proven prompts inspired by product teams shipping weekly releases.',
  },
  {
    imageUrl: '/images/placeholder-2.jpg',
    title: 'Unusual Uses for Everyday Household Items',
    author: 'Bob Jones',
    date: 'Feb 12, 2022',
    readTime: '5 min read',
    excerpt:
      'Repurpose the mundane: twenty small hacks that save setup time, streamline workflow, and cut costs.',
  },
  {
    imageUrl: '/images/placeholder-3.jpg',
    title: 'Spectacular Natural Wonders Everyone Should See',
    author: 'John Alvarez',
    date: 'Mar 24, 2022',
    readTime: '6 min read',
    excerpt:
      'Refuel your creativity by exploring landscapes that have shaped design palettes across industries.',
  },
];

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <section className="hero-card">
        <div className="hero-content">
          <p className="hero-category">{featuredPost.category}</p>
          <h1>{featuredPost.title}</h1>
          <p className="hero-excerpt">{featuredPost.excerpt}</p>
          <Link className="primary-button" to="/">
            {featuredPost.cta}
          </Link>
        </div>
      </section>

      <section className="post-section">
        <header className="section-header">
          <h2>Latest insights</h2>
        </header>

        <div className="post-grid">
          {articles.map((article) => (
            <article key={article.title} className="post-card">
              <div className="image-placeholder" aria-hidden="true" style={{ backgroundImage: `url(${article.imageUrl})` }}>
                <img src={article.imageUrl} alt={article.title} style={{ display: 'none' }} />
              </div>
              <h3>{article.title}</h3>
              <p className="meta">
                {article.author} &bull; {article.date} &bull; {article.readTime}
              </p>
              <p>{article.excerpt}</p>
              <Link className="text-link" to="/">
                Continue reading →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand">
          <p className="brand-name">@ Your Company</p>
          <p>
            Donec nec ante nibh. Vestibulum tincidunt lectus sed magna fringilla sagittis. Nulla
            facilisi.
          </p>
          <p className="legal">© 2022 Your Company. All rights reserved.</p>
          <nav className="legal-links">
            <Link to="/">Terms of Service</Link>
            <Link to="/">Privacy Policy</Link>
          </nav>
        </div>

        <div className="footer-columns">
          <div>
            <h4>Tags</h4>
            <ul className="tag-cloud">
              {['Health', 'Lifestyle', 'Social', 'Entertainment', 'News', 'Books', 'Design'].map(
                (tag) => (
                  <li key={tag}>
                    <Link to="/">{tag}</Link>
                  </li>
                )
              )}
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
