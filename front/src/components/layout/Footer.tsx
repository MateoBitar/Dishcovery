// Footer.tsx
import React from 'react';
import '../../styles/layout.css';

// Footer component
export default function Footer(): React.ReactElement {
  return (
    <footer className="footer">
      <div className="footer-community">
        <h4>Join Our Growing Community</h4>
        <div className="footer-stats">
          <div className="stat">
            <span className="stat-number">1K+</span>
            <span className="stat-label">Recipes Shared</span>
          </div>
          <div className="stat">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Home Cooks</span>
          </div>
          <div className="stat">
            <span className="stat-number">50K+</span>
            <span className="stat-label">Meals Created</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>@2025 Dishcovery. All rights reserved.</p>
      </div>
    </footer>
  );
}
