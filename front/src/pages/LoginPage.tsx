// LoginPage.tsx
import { useState, ReactElement } from 'react';
import LoginForm from '../components/forms/LoginForm.tsx';
import RegisterForm from '../components/forms/RegisterForm.tsx';
import { ChefHat } from 'lucide-react';
import '../styles/auth.css';

// LoginPage component
export default function LoginPage(): ReactElement {
  const [showRegister, setShowRegister] = useState<boolean>(false);  // State to toggle between login and register forms

  return (
    <div className="login-page">
      <div className="auth-container">
        <div className="auth-navbar-left">
          <ChefHat className="auth-icon" />
          <span className="logo-text">Dishcovery</span>
        </div>

        <div className="auth-toggle">
          <h2 className="auth-heading">
            {showRegister ? 'Create an account' : 'Welcome back'}
          </h2>
          <p className="auth-subtext">
            {showRegister
              ? 'Join our community of passionate home cooks'
              : 'Enter your credentials to access your account'}
          </p>
        </div>

        {showRegister ? (
          <RegisterForm setShowRegister={setShowRegister} />
        ) : (
          <LoginForm />
        )}

        <p className="auth-switch">
          {showRegister ? 'Already have an account? ' : "Don't have an account? "}
          <span
            className="auth-switch-link"
            onClick={() => setShowRegister((prev) => !prev)}
          >
            {showRegister ? 'Login' : 'Register'}
          </span>
        </p>
      </div>
    </div>
  );
}
