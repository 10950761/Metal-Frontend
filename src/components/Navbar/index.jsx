import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
  FaBell,
  FaSearch,
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import "./index.css";

const Navbar = ({ toggleSidebar }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
          <span className="logo-icon">🔧</span>
          <span className="logo-text">Metal Tools Pro</span>
        </div>
      </div>

      {/* Center Nav Links */}
      <div className={`navbar-center ${isMenuOpen ? "open" : ""}`}>
        <button 
          className="nav-link" 
          onClick={() => {
            navigate('/');
            setIsMenuOpen(false);
          }}
        >
          Home
        </button>
        <button 
          className="nav-link" 
          onClick={() => {
            navigate('/about');
            setIsMenuOpen(false);
          }}
        >
          About
        </button>
        <button 
          className="nav-link" 
          onClick={() => {
            navigate('/contact');
            setIsMenuOpen(false);
          }}
        >
          Contacts
        </button>
      </div>

      {/* Right Section */}
      <div className="navbar-right">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search tools"
          />
        </div>

        <div className="icon-wrapper notification-bell">
          <FaBell />
          <span className="notification-badge">*</span>
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
          <span className="username">{username}</span>
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