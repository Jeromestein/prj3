import { Link } from 'react-router-dom';

const categories = [
  'Product Design',
  'Content Strategy',
  'Engineering',
  'Leadership',
  'Marketing',
  'Teams',
  'Newsletters',
];

const featuredPosts = [
  {
    id: 'future-of-content',
    title: 'Content operations in 2025: playbooks for scaling editorial quality',
    author: 'Rowan Singh',
    date: 'May 2, 2024',
    readTime: '11 min read',
    description:
      'How top-performing media teams align AI tooling, human storytelling, and governance to ship consistently great work.',
    tag: 'Featured',
  },
  {
    id: 'retention-design',
    title: 'Designing retention loops your audience actually wants to join',
    author: 'Mira Cheng',
    date: 'Apr 18, 2024',
    readTime: '9 min read',
    description:
      'From first impression to habit formation, learn the micro-interactions that turn casual readers into loyal members.',
    tag: 'Playbook',
  },
  {
    id: 'newsletter-stack',
    title: 'Ship smarter newsletters with an editorial stack that scales',
    author: 'Evelyn Howard',
    date: 'Apr 4, 2024',
    readTime: '7 min read',
    description:
      'A practical walkthrough of the tools, automation, and runbooks behind our flagship publication.',
    tag: 'Toolkit',
  },
];

const editorialHighlights = [
  {
    title: 'Inside the studio: how our multimedia team plans a narrative series',
    author: 'Marcus Reid',
    date: 'Mar 22, 2024',
  },
  {
    title: 'What reader research taught us about building trust and momentum',
    author: 'Sara Kim',
    date: 'Mar 14, 2024',
  },
  {
    title: 'The rituals our remote writers rely on to stay in sync',
    author: 'Jamie Patel',
    date: 'Mar 7, 2024',
  },
];

const Posts = () => (
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

    <section className="posts-grid">
      {featuredPosts.map((post) => (
        <article key={post.id} className="post-article">
          <div className="post-meta">
            <span className="tag">{post.tag}</span>
            <span>
              {post.date} • {post.readTime}
            </span>
          </div>
          <h2>{post.title}</h2>
          <p className="excerpt">{post.description}</p>
          <p className="byline">By {post.author}</p>
          <Link to={`/posts/${post.id}`} className="text-link">
            Read story →
          </Link>
        </article>
      ))}
    </section>

    <section className="highlights-section">
      <div className="section-heading">
        <h2>Editorial highlights</h2>
        <Link to="/" className="text-link">
          View all topics →
        </Link>
      </div>
      <div className="highlights-grid">
        {editorialHighlights.map((item) => (
          <article key={item.title} className="highlight-card">
            <h3>{item.title}</h3>
            <p>
              {item.author} • {item.date}
            </p>
            <Link to="/" className="text-link">
              Keep reading →
            </Link>
          </article>
        ))}
      </div>
    </section>
  </div>
);

export default Posts;
