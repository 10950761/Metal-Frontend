import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {  FaUserCircle, FaBars, FaTimes, FaChartLine } from "react-icons/fa";
import NotificationBell from "../../topcomponents/Notification";
import "./index.css";

const Navbar = ({ toggleSidebar }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState("User");
  const navigate = useNavigate();

  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setImage(savedImage);
    }

    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImage(base64String);
        localStorage.setItem("profileImage", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <nav className="modern-navbar">
      {/* Left: Logo */}
      <div className="navbar-left">
        <button
          className="menu-toggle sidebar-btn"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>
        <div className="navbar-logo">
          <div className="logo-container">
            <FaChartLine className="logo-icon" />
            <div className="logo-text-container">
              <span className="logo-brand">Willin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center Nav Links */}
      <div className={`navbar-center ${isMenuOpen ? "open" : ""}`}>
        <button 
          className="nav-link" 
          onClick={() => {
            navigate('/dashboard');
            setIsMenuOpen(false);
          }}
        >
          <span className="nav-icon">📊</span>
          Dashboard
        </button>
        <button 
          className="nav-link" 
          onClick={() => {
            navigate('/inventory');
            setIsMenuOpen(false);
          }}
        >
          <span className="nav-icon">📦</span>
          Inventory
        </button>
        <button 
          className="nav-link" 
          onClick={() => {
            navigate('/analytics');
            setIsMenuOpen(false);
          }}
        >
          <span className="nav-icon">📈</span>
          Analytics
        </button>
        <button 
          className="nav-link" 
          onClick={() => {
            navigate('/reports');
            setIsMenuOpen(false);
          }}
        >
          <span className="nav-icon">📋</span>
          Reports
        </button>
      </div>

      {/* Right Section */}
      <div className="navbar-right">
        <div className="navbar-actions">
          <div className="icon-wrapper notification-bell">
            <NotificationBell />
          </div>

          <div className="user-profile">
            <label htmlFor="upload-profile" className="profile-image-label">
              {image ? (
                <img src={image} alt="Profile" className="profile-image" />
              ) : (
                <FaUserCircle className="default-icon" />
              )}
              <input
                type="file"
                id="upload-profile"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </label>
            <div className="user-info">
              <span className="username">{username}</span>
              <span className="user-role">Business Manager</span>
            </div>
          </div>
        </div>

        <button
          className="menu-toggle mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;