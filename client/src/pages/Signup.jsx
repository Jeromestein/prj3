import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, error, clearError, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async ({ name, email, password }) => {
    setIsSubmitting(true);
    const result = await signup({ name, email, password });
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <section className="page-card">
      <AuthForm
        title="Create your account"
        submitLabel="Sign up"
        onSubmit={handleSubmit}
        error={error}
        isSubmitting={isSubmitting}
        showNameField
        onFieldChange={clearError}
      />
      <p className="form-footer">
        Already registered?{' '}
        <Link to="/login" onClick={clearError}>
          Log in
        </Link>
        .
      </p>
    </section>
  );
};

export default Signup;
