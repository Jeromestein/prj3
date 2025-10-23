import { useEffect, useState } from 'react';

const emptyState = {
  title: '',
  topic: '',
  readTime: '5 min read',
  excerpt: '',
  content: '',
};

const PostForm = ({ initialValues, mode = 'create', onSubmit, error: externalError }) => {
  const [formState, setFormState] = useState(initialValues || emptyState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialValues) {
      setFormState((prev) => ({
        ...prev,
        ...initialValues,
      }));
    }
  }, [initialValues]);

  useEffect(() => {
    if (externalError) {
      setError(externalError);
    }
  }, [externalError]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(formState);
    } catch (err) {
      setError(err?.message || 'Submission failed, please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h1>{mode === 'create' ? 'Publish a New Post' : 'Edit Post'}</h1>
      <p className="form-subtext">
        Write your story in Markdown and we&apos;ll render it for readers. All fields are required.
      </p>

      {error && (
        <div className="form-banner error">
          <p>{error}</p>
        </div>
      )}

      <label htmlFor="title">
        Title
        <input
          id="title"
          name="title"
          type="text"
          value={formState.title}
          onChange={handleChange}
          required
          placeholder="Enter a compelling headline"
        />
      </label>

      <label htmlFor="topic">
        Topic
        <input
          id="topic"
          name="topic"
          type="text"
          value={formState.topic}
          onChange={handleChange}
          required
          placeholder="e.g. Editorial Ops"
        />
      </label>

      <label htmlFor="readTime">
        Estimated read time
        <input
          id="readTime"
          name="readTime"
          type="text"
          value={formState.readTime}
          onChange={handleChange}
          placeholder="e.g. 8 min read"
        />
      </label>

      <label htmlFor="excerpt">
        Excerpt
        <textarea
          id="excerpt"
          name="excerpt"
          rows={3}
          value={formState.excerpt}
          onChange={handleChange}
          required
          placeholder="Summarize the key takeaway in one or two sentences"
        />
      </label>

      <label htmlFor="content">
        Body (Markdown supported)
        <textarea
          id="content"
          name="content"
          rows={12}
          value={formState.content}
          onChange={handleChange}
          required
          placeholder="Craft your post using Markdown formatting..."
        />
      </label>

      <button type="submit" className="primary-button" disabled={submitting}>
        {submitting ? 'Submitting...' : mode === 'create' ? 'Publish post' : 'Save changes'}
      </button>
    </form>
  );
};

export default PostForm;
