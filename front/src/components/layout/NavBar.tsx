// NavBar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import '../../styles/layout.css';

// Navigation link interface
interface NavLink {
  label: string;
  path: string;
}

// NavBar component
export default function NavBar(): React.ReactElement {
  const location = useLocation();  // Get current location

  // Define navigation links
  const navLinks: NavLink[] = [
    { label: 'Home', path: '/home' },
    { label: 'Browse Recipes', path: '/browse' },
    { label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="navbar">
      {/* Left Side */}
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <ChefHat className="icon" />
          <span>Dishcovery</span>
        </Link>
      </div>

      {/* Right Side */}
      <div className="navbar-right">
        {navLinks.map(({ label, path }) => (
          <Link
            key={path}
            to={path}
            className={`navbar-link ${
              location.pathname === path ? 'active' : ''
            }`}
          >
            {label}
          </Link>
        ))}

        <Link to="/create" className="navbar-link navbar-share">
          + Share Recipe
        </Link>
      </div>
    </nav>
  );
}
