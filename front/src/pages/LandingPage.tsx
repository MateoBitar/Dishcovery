// LandingPage.tsx
import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.tsx';
import Badge from '../components/ui/Badge.tsx';
import { ChefHat } from 'lucide-react';
import { ImageWithFallback } from '../components/ui/imageWithFallback.tsx';
import mainImage from '../../assets/main.png';
import '../styles/landing.css';

// LandingPage component
export default function LandingPage(): ReactElement {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="page-container">
      <ImageWithFallback
        src={mainImage}
        alt="Fresh ingredients and cooking"
        className="background-image"
        role="presentation"
      />

      <div className="landing">
        <div className="left-panel">
          <header className="header">
            <div className="logo-container">
              <ChefHat className="icon" />
              <span className="logo-text">Dishcovery</span>
            </div>
          </header>

          <main className="main-content">
            <div className="content-wrapper">
              <Badge className="badge">Smart Recipe Discovery</Badge>

              <h1 className="heading">What should I cook today?</h1>

              <p className="subheading">
                Transform your ingredients into delicious meals. Reduce waste,
                discover new recipes, and join a community of passionate home
                cooks from all around the world.
              </p>

              <div className="button-wrapper">
                <Button
                  onClick={() => navigate('/login')}
                  className="cta-button"
                >
                  Let&apos;s Start
                </Button>
              </div>

              <div className="stats">
                <div>
                  <div className="stat-number">10K+</div>
                  <p className="stat-label">Active Cooks</p>
                </div>
                <div>
                  <div className="stat-number">1K+</div>
                  <p className="stat-label">Recipes</p>
                </div>
                <div>
                  <div className="stat-number">100%</div>
                  <p className="stat-label">Free</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
