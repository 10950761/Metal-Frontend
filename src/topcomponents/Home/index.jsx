import React, { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import { Wrench, Hammer, Cog, Zap, ChevronRight, User, LogIn } from 'lucide-react';
import './index.css';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeParticle, setActiveParticle] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveParticle(prev => (prev + 1) % 20);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const tools = [
    { icon: Hammer, name: "Forging Hammers", delay: "0s" },
    { icon: Wrench, name: "Precision Tools", delay: "0.5s" },
    { icon: Cog, name: "Industrial Gears", delay: "1s" },
    { icon: Zap, name: "Welding Equipment", delay: "1.5s" }
  ];

  const features = [
    "Premium Metal Tools",
    "Industrial Equipment",
    "Custom Fabrication",
    "Professional Grade"
  ];

  return (
    <div className="home-container">
      <div className="background-particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`particle ${activeParticle === i ? 'active' : ''}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="shine-overlay">
        <div className="shine-bar" />
      </div>

      <nav className="home-header">
        <div className="logo-section">
          <Cog className="logo-icon" />
          <h1 className="logo-text">Metal Tools Pro Shop</h1>
        </div>
        <div className="auth-buttons">
          <button className="sign-up-btn" onClick={() => navigate('/signup')} >
            <User className="icon" />
            <span>Sign Up</span>
          </button>
          <button className="login-btn"  onClick={() => navigate('/login')}>
            <LogIn className="icon" />
            <span>Login</span> 
          </button>
        </div>
      </nav>

      <div className="hero-section">
        <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
          <h2 className="hero-title">
            <span className="forge-text">Forge Your</span><br />
            <span className="future-text">Future</span>
          </h2>
          <p className="hero-subtext">
            Professional metalworking tools and equipment for craftsmen who demand excellence. Where precision meets power.
          </p>

          <button className="hero-button"  onClick={() => navigate('/explore')}>
            <span>Explore Tools</span>
            <ChevronRight className="arrow-icon" />
          </button>
        </div>

        <div className="tools-section">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <div key={index} className={`tool-card ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: tool.delay }}>
                <div className="tool-icon-wrapper">
                  <Icon className="tool-icon" />
                </div>
                <h3 className="tool-name">{tool.name}</h3>
              </div>
            );
          })}
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-item">
              {feature}
            </div>
          ))}
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Cog className="footer-icon" />
            <span className="footer-logo">Metal Shop Pro</span>
            <span className="footer-divider">|</span>
            <span className="footer-copy">© 2025 All Rights Reserved</span>
          </div>
          <div className="footer-links">
            <button>About</button>
            <button>Products</button>
            <button>Contact</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
