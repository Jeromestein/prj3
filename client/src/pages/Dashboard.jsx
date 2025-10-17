import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, refreshUser } = useAuth();

  return (
    <section className="page-card">
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
        <button type="button" className="secondary-button" onClick={refreshUser}>
          Refresh session
        </button>
      </div>
    </section>
  );
};

export default Dashboard;
