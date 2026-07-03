// RegisterForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/auth.css';

// Register data interface
interface RegisterData {
  username: string;
  password: string;
  user_desc: string;
  diet_pref: string;
}

// Form errors interface
interface FormErrors {
  [key: string]: string | string[];
}

// Props for RegisterForm component
interface RegisterFormProps {
  setShowRegister?: (show: boolean) => void;
}

// RegisterForm component
export default function RegisterForm({ setShowRegister }: RegisterFormProps): React.ReactElement {
  const { register, loading, error} = useAuth();  // Auth hook

  const [userData, setUserData] = useState<RegisterData>({  // State for registration data
    username: '',
    password: '',
    user_desc: '',
    diet_pref: 'none',
  });

  const [errors, setErrors] = useState<FormErrors>({});  // State for form errors

  // Frontend validation function
  const validate = (data: RegisterData): FormErrors => {
    const newErrors: FormErrors = {};

    // Username
    if (!data.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (data.username.length < 3 || data.username.length > 100) {
      newErrors.username = 'Username must be between 3 and 100 characters';
    }

    // Password
    if (!data.password) {
      newErrors.password = ['Password is required'];
    } else {
      const pwErrors: string[] = [];
      if (data.password.length < 8) pwErrors.push('At least 8 characters');
      if (!/[A-Z]/.test(data.password)) pwErrors.push('At least one uppercase letter');
      if (!/[a-z]/.test(data.password)) pwErrors.push('At least one lowercase letter');
      if (!/\d/.test(data.password)) pwErrors.push('At least one number');
      if (!/[@$!%*?&]/.test(data.password)) pwErrors.push('At least one special character');
      
      if (pwErrors.length > 0) newErrors.password = pwErrors;
    }

    // Description
    if (data.user_desc.length > 500) {
      newErrors.user_desc = 'Description must not exceed 500 characters';
    }

    // Diet preference
    const allowedDiets = ['none', 'vegetarian', 'vegan', 'gluten-free', 'low-carb'];
    if (!allowedDiets.includes(data.diet_pref)) {
      newErrors.diet_pref = 'Invalid diet preference';
    }

    return newErrors;
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // clear field-specific error while typing
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const validationErrors = validate(userData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const success = await register(userData);
      if (success && setShowRegister) setShowRegister(false);
    } catch (err) {
      setErrors({ username: (err as Error).message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {/* Username */}
      <input
        name="username"
        className="auth-input"
        placeholder="Username"
        value={userData.username}
        onChange={handleChange}
        required
      />
      {error && <div className="form-error">{error}</div>}

      {/* Password */}
      <input
        name="password"
        type="password"
        className="auth-input"
        placeholder="Password"
        value={userData.password}
        onChange={handleChange}
        required
      />
      {errors.password && (
        <div className="form-error">
          {Array.isArray(errors.password) ? (
            <ul>
              {errors.password.map((err: string, idx: number) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          ) : (
            errors.password
          )}
        </div>
      )}

      {/* Description */}
      <textarea
        name="user_desc"
        className="auth-input"
        placeholder="Tell us about yourself (optional)"
        value={userData.user_desc}
        onChange={(e) => setUserData({ ...userData, user_desc: e.target.value })}
        rows={3}
      />
      {errors.user_desc && <div className="form-error">{errors.user_desc}</div>}

      {/* Diet Preference */}
      <select
        name="diet_pref"
        className="auth-input"
        value={userData.diet_pref}
        onChange={handleChange}
      >
        <option value="none">No dietary preference</option>
        <option value="vegetarian">Vegetarian</option>
        <option value="vegan">Vegan</option>
        <option value="gluten-free">Gluten-Free</option>
        <option value="low-carb">Low-Carb</option>
      </select>
      {errors.diet_pref && <div className="form-error">{errors.diet_pref}</div>}

      <button type="submit" className="auth-btn btn-default" disabled={loading}>
        {loading ? 'Creating account...' : 'Register'}
      </button>
    </form>
  );
}
