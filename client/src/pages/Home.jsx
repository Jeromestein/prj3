import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="page-card">
      <h1>Modern Auth Starter</h1>
      <p>
        This progressive web app showcases a secure React front end, backed by an Express and
        MongoDB API with session-based authentication.
      </p>
      <p>
        {isAuthenticated ? (
          <>
            Visit your <Link to="/dashboard">dashboard</Link> to view account details.
          </>
        ) : (
          <>
            Ready to jump in? <Link to="/signup">Create an account</Link> or{' '}
            <Link to="/login">log in</Link>.
          </>
        )}
      </p>
    </section>
  );
};

export default Home;
