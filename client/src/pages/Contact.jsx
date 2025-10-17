import { useState } from 'react';
import { Link } from 'react-router-dom';

const supportChannels = [
  {
    heading: 'Product questions',
    description: 'Need clarification on features or implementation advice? Our product team replies within 24 hours.',
    linkLabel: 'Browse FAQs',
    link: '/',
  },
  {
    heading: 'Press & media',
    description: 'Looking for press releases, logos, or leadership insights? Reach out to our communications crew.',
    linkLabel: 'Contact PR',
    link: '/',
  },
  {
    heading: 'Partnerships',
    description: 'Interested in collaborating or launching a co-marketing campaign? Let’s explore opportunities.',
    linkLabel: 'Talk to partnerships',
    link: '/',
  },
];

const initialFormState = {
  name: '',
  email: '',
  topic: 'general',
  message: '',
};

const Contact = () => {
  const [formState, setFormState] = useState(initialFormState);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // In a real app this would post to the backend.
    setSubmitted(true);
    setFormState(initialFormState);
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div>
          <p className="eyebrow">Get in touch</p>
          <h1>Let&apos;s build something memorable together</h1>
          <p>
            Whether you&apos;re exploring a new integration, planning an editorial feature, or need
            technical guidance, our team is on standby.
          </p>
        </div>
        <div className="hero-card contact-meta">
          <p className="meta-title">Headquarters</p>
          <p>240 Innovation Way, Irvine, CA 92617</p>
          <p>Mon - Fri · 9:00 AM – 5:00 PM PST</p>
          <p className="meta-phone">+1 (273) 329-1223</p>
        </div>
      </section>

      <section className="support-grid">
        {supportChannels.map((card) => (
          <article key={card.heading} className="support-card">
            <h2>{card.heading}</h2>
            <p>{card.description}</p>
            <Link to={card.link} className="text-link">
              {card.linkLabel} →
            </Link>
          </article>
        ))}
      </section>

      <section className="contact-layout">
        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Send us a message</h2>
          <p className="form-subtext">
            Share a few details and we’ll route your note to the right teammate.
          </p>
          {submitted && (
            <div className="form-banner">
              <p>Thanks! We received your message and will respond shortly.</p>
            </div>
          )}
          <label htmlFor="name">
            Full name
            <input
              id="name"
              name="name"
              type="text"
              value={formState.name}
              onChange={handleChange}
              placeholder="Ada Lovelace"
              required
            />
          </label>
          <label htmlFor="email">
            Email
            <input
              id="email"
              name="email"
              type="email"
              value={formState.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </label>
          <label htmlFor="topic">
            Topic
            <select id="topic" name="topic" value={formState.topic} onChange={handleChange}>
              <option value="general">General inquiry</option>
              <option value="support">Support request</option>
              <option value="partnership">Partnership opportunity</option>
              <option value="press">Press & media</option>
            </select>
          </label>
          <label htmlFor="message">
            Message
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formState.message}
              onChange={handleChange}
              placeholder="Tell us what’s on your mind…"
              required
            />
          </label>
          <button type="submit" className="primary-button">
            Send message
          </button>
        </form>

        <aside className="contact-aside">
          <div className="info-card">
            <h3>Editorial office</h3>
            <p>240 Innovation Way, Irvine, CA 92617</p>
            <p>Mon - Fri · 9:00 AM – 5:00 PM PST</p>
            <p className="meta-phone">+1 (273) 329-1223</p>
          </div>
          <div className="info-card">
            <h3>Customer success</h3>
            <p>10 Oak Tree Avenue, Austin, TX 13021</p>
            <p>Mon - Fri · 9:00 AM – 5:00 PM CST</p>
            <p className="meta-phone">+1 (273) 329-1223</p>
          </div>
          <div className="info-card secondary">
            <h4>Prefer a quick chat?</h4>
            <p>
              Join our weekly live Q&amp;A on Thursdays or drop into the community forum anytime for
              peer-to-peer advice.
            </p>
            <Link to="/" className="secondary-button">
              View community events
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default Contact;
