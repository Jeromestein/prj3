import { useState } from 'react';

const AuthForm = ({
  title,
  submitLabel,
  onSubmit,
  error,
  isSubmitting,
  showNameField = false,
  onFieldChange,
}) => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (onFieldChange) {
      onFieldChange();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(formState);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h1>{title}</h1>
      {error && <p className="form-error">{error}</p>}
      {showNameField && (
        <label htmlFor="name">
          Name
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Ada Lovelace"
            value={formState.name}
            onChange={handleChange}
            required
          />
        </label>
      )}
      <label htmlFor="email">
        Email
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={formState.email}
          onChange={handleChange}
          required
        />
      </label>
      <label htmlFor="password">
        Password
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={showNameField ? 'new-password' : 'current-password'}
          placeholder="********"
          value={formState.password}
          onChange={handleChange}
          required
          minLength={8}
        />
      </label>
      <button type="submit" className="primary-button" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting…' : submitLabel}
      </button>
    </form>
  );
};

export default AuthForm;
