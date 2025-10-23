import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { createPost } from '../api/posts';
import { handleApiError } from '../api/client';

const NewPost = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (payload) => {
    setError(null);
    try {
      const { data } = await createPost(payload);
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

  return (
    <div className="post-editor-page">
      <PostForm mode="create" onSubmit={handleSubmit} error={error} />
    </div>
  );
};

export default NewPost;
