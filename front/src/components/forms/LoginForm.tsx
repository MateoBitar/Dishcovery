// LoginForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth.css';

// Login credentials interface
interface LoginCredentials {
  username: string;
  password: string;
}

// LoginForm component
export default function LoginForm(): React.ReactElement {
  const navigate = useNavigate();  // Navigation hook
  const [credentials, setCredentials] = useState<LoginCredentials>({ username: '', password: '' });  // State for login credentials
  const { login, loading, error } = useAuth();  // Auth hook

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const success = await login(credentials);
      if (success) {
        navigate('/home');
      }
    } catch {
      // errors are already handled in useAuth
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <input
        name="username"
        className="auth-input"
        placeholder="Username"
        value={credentials.username}
        onChange={handleChange}
        required
      />

      <input
        name="password"
        type="password"
        className="auth-input"
        placeholder="Password"
        value={credentials.password}
        onChange={handleChange}
        required
      />

      {error && <div className="form-error">{error}</div>}

      <button type="submit" className="auth-btn btn-default" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
