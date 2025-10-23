import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchMyPosts, deletePost as deletePostRequest } from '../api/posts';
import { handleApiError } from '../api/client';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadPosts = useCallback(async () => {
    if (!user) {
      return;
    }
    setLoadingPosts(true);
    setPostsError(null);
    try {
      const { data } = await fetchMyPosts({ sort: 'date' });
      setPosts(data.posts || []);
    } catch (err) {
      setPostsError(handleApiError(err));
    } finally {
      setLoadingPosts(false);
    }
  }, [user]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleDeletePost = async (post) => {
    if (!post) return;
    const shouldDelete = window.confirm(
      `Delete "${post.title}"? This action cannot be undone.`
    );
    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingId(post.id);
      await deletePostRequest(post.id);
      await loadPosts();
    } catch (err) {
      setPostsError(handleApiError(err));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="dashboard-page">
      <div className="page-card">
        <h1>Your dashboard</h1>
        <p>Welcome back, {user?.name}.</p>
        <div className="card">
          <h2>Account details</h2>
          <dl>
            <div>
              <dt>Email</dt>
              <dd>{user?.email}</dd>
            </div>
            <div>
              <dt>Roles</dt>
              <dd>{user?.roles?.join(', ') || 'user'}</dd>
            </div>
            <div>
              <dt>Member since</dt>
              <dd>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleString()
                  : 'Pending sync'}
              </dd>
            </div>
          </dl>
          <div className="card-actions">
            <button type="button" className="secondary-button" onClick={refreshUser}>
              Refresh session
            </button>
            <Link to="/posts/new" className="primary-button ghost">
              Write a post
            </Link>
          </div>
        </div>
      </div>

      <div className="card dashboard-posts">
        <div className="dashboard-posts__header">
          <h2>Your posts</h2>
          <button
            type="button"
            className="secondary-button"
            onClick={loadPosts}
            disabled={loadingPosts}
          >
            {loadingPosts ? 'Refreshing...' : 'Refresh list'}
          </button>
        </div>

        {postsError && (
          <div className="form-banner error">
            <p>{postsError}</p>
          </div>
        )}

        {loadingPosts ? (
          <div className="dashboard-posts__empty">
            <p>Loading your posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="dashboard-posts__empty">
            <p>You haven&apos;t published anything yet.</p>
            <Link to="/posts/new" className="primary-button">
              Publish your first post
            </Link>
          </div>
        ) : (
          <ul className="dashboard-posts__list">
            {posts.map((post) => (
              <li key={post.id} className="dashboard-posts__item">
                <div>
                  <h3>{post.title}</h3>
                  <p className="meta">
                    {dateFormatter.format(new Date(post.createdAt))} • {post.readTime}
                  </p>
                </div>
                <div className="actions">
                  <Link to={`/posts/${post.slug || post.id}`} className="text-link">
                    View
                  </Link>
                  <Link to={`/posts/${post.id}/edit`} className="text-link">
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDeletePost(post)}
                    className="link-button danger"
                    disabled={deletingId === post.id}
                  >
                    {deletingId === post.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
