import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { fetchPost, updatePost } from '../api/posts';
import { handleApiError } from '../api/client';

const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await fetchPost(postId);
        if (isMounted) {
          if (data.post) {
            setInitialValues({
              title: data.post.title,
              topic: data.post.topic,
              readTime: data.post.readTime,
              excerpt: data.post.excerpt,
              content: data.post.content,
            });
          } else {
            setError('Post not found');
          }
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

  const handleSubmit = async (payload) => {
    setError(null);
    try {
      const { data } = await updatePost(postId, payload);
      const post = data.post;
      if (post) {
        navigate(`/posts/${post.slug || post.id}`);
      }
    } catch (err) {
      const message = handleApiError(err);
      setError(message);
      throw new Error(message);
    }
  };

  if (loading) {
    return (
      <div className="post-editor-page">
        <p>Loading post details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="post-editor-page">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="post-editor-page">
      <PostForm mode="edit" onSubmit={handleSubmit} initialValues={initialValues} error={error} />
    </div>
  );
};

export default EditPost;
