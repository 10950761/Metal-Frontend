import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Package,
  TrendingUp,
  DollarSign,
  ChevronRight,
  User,
  LogIn,
} from "lucide-react";
import "./index.css";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeParticle, setActiveParticle] = useState(0);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveParticle((prev) => (prev + 1) % 20);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: BarChart3, name: "Sales Analytics", delay: "0s" },
    { icon: Package, name: "Inventory Tracking", delay: "0.5s" },
    { icon: TrendingUp, name: "Purchase Management", delay: "1s" },
    { icon: DollarSign, name: "Revenue Insights", delay: "1.5s" },
  ];

  const capabilities = [
    "Real-time Stock Management",
    "Sales & Purchase Recording",
    "Advanced Analytics Dashboard",
    "Multi-user Access Control",
  ];

  return (
    <div className="home-container">
      {/* Background particles */}
      <div className="background-particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`particle ${activeParticle === i ? "active" : ""}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Animated shine overlay */}
      <div className="shine-overlay">
        <div className="shine-bar" />
      </div>

      {/* Navigation */}
      <nav className="home-header">
        <div className="logo-section">
          <BarChart3 className="logo-icon" />
          <h1 className="logo-text">Willin</h1>
        </div>
        <div className="auth-buttons">
          <button
            className="auth-btn signup-color"
            onClick={() => handleNavigation("/signup")}
          >
            <User className="icon" />
            <span>Sign Up</span>
          </button>
          <button
            className="auth-btn login-color"
            onClick={() => handleNavigation("/login")}
          >
            <LogIn className="icon" />
            <span>Login</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div className={`hero-content ${isVisible ? "visible" : ""}`}>
          <h2 className="hero-title">
            <span className="forge-text">Smart Inventory</span>
            <br />
            <span className="future-text">Management</span>
          </h2>
          <p className="hero-subtext">
            Streamline your business operations with comprehensive inventory
            tracking, sales management, and powerful analytics. Built for modern
            businesses that demand efficiency.
          </p>

          <button
            className="hero-button"
            onClick={() => handleNavigation("/explore")}
          >
            <span>Get Started</span>
            <ChevronRight className="arrow-icon" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`tool-card ${isVisible ? "visible" : ""}`}
                style={{ transitionDelay: feature.delay }}
              >
                <div className="tool-icon-wrapper">
                  <div>
                    <Icon className="tool-icon" />
                  </div>
                </div>
                <h3 className="tool-name">{feature.name}</h3>
              </div>
            );
          })}
        </div>

        {/* Capabilities */}
        <div className="capabilities-grid">
          {capabilities.map((capability, index) => (
            <div key={index} className="capability-item">
              <span className="capability-text">{capability}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <BarChart3 className="footer-icon" />
            <span className="footer-logo">Willin</span>
            <span className="footer-divider">|</span>
            <span className="footer-copy">© 2025 All Rights Reserved</span>
          </div>
          <div className="footer-links">
            <button>About</button>
            <button>Features</button>
            <button>Contact</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
