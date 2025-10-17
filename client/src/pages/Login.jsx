import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, clearError, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async ({ email, password }) => {
    setIsSubmitting(true);
    const result = await login({ email, password });
    setIsSubmitting(false);

    if (result.success) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  };

  return (
    <section className="page-card">
      <AuthForm
        title="Welcome back"
        submitLabel="Log in"
        onSubmit={handleSubmit}
        error={error}
        isSubmitting={isSubmitting}
        onFieldChange={clearError}
      />
      <p className="form-footer">
        No account yet?{' '}
        <Link to="/signup" onClick={clearError}>
          Sign up
        </Link>
        .
      </p>
    </section>
  );
};

export default Login;
