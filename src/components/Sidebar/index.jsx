import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaBell,
  FaSun,
  FaMoon,
  FaHistory,
  FaFileExport,
  FaExchangeAlt,
  FaClock,
  FaTimes,
} from "react-icons/fa";
import "./index.css";

function Sidebar({ isOpen, onClose }) {
  const [openMenus, setOpenMenus] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [lastLogin, setLastLogin] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute('data-theme', !darkMode ? 'dark' : 'light');
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("username");
      localStorage.removeItem("lastLogin");
      setUser(null);
      navigate("/login");
    }
  };

  // Initialize theme and user data
  useEffect(() => {
    // Get stored theme preference
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setDarkMode(storedTheme === "dark");
      document.documentElement.setAttribute('data-theme', storedTheme);
    }

    // Get user data
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Get last login time
    const storedLogin = localStorage.getItem("lastLogin");
    if (storedLogin) {
      try {
        setLastLogin(new Date(storedLogin).toLocaleString());
      } catch (error) {
        setLastLogin("Unknown");
      }
    } else {
      setLastLogin("Unknown");
    }
  }, []);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <aside className={`custom-sidebar ${darkMode ? "dark-mode" : ""} ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <button className="sidebar-close-button" onClick={onClose}>
          <FaTimes />
        </button>
        
        {user && (
          <div className="sidebar-user-info">
            <span className="user-name">
              Welcome, {user.name || user.username || 'User'}
            </span>
            {lastLogin && (
              <span className="last-login">
                <FaClock /> Last login: {lastLogin}
              </span>
            )}
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {/* Dashboard Section */}
        <div className="sidebar-section">
          <button
            onClick={() => toggleMenu("dashboard")}
            className="sidebar-toggle"
            aria-expanded={openMenus.dashboard}
            aria-controls="dashboard-menu"
          >
            <span className="sidebar-toggle-content">
              <FaTachometerAlt /> Overviews
            </span>
            {openMenus.dashboard ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          
          {openMenus.dashboard && (
            <div className="sidebar-submenu" id="dashboard-menu">
              <Link to="/dashboard/stock-summary" className="sidebar-link" onClick={onClose}>
                <FaBoxOpen /> Stock Overview
              </Link>
              <Link to="/dashboard/purchase-analysis" className="sidebar-link" onClick={onClose}>
                <FaShoppingCart /> Purchase Analytics
              </Link>
              <Link to="/dashboard/sales-analysis" className="sidebar-link" onClick={onClose}>
                <FaChartLine /> Sales Analytics
              </Link>
              <Link to="/dashboard/revenue-summary" className="sidebar-link" onClick={onClose}>
                <FaFileExport /> Revenue Summary
              </Link>
            </div>
          )}
        </div>

        {/* Transactions Section */}
        <div className="sidebar-section">
          <button
            onClick={() => toggleMenu("transactions")}
            className="sidebar-toggle"
            aria-expanded={openMenus.transactions}
            aria-controls="transactions-menu"
          >
            <span className="sidebar-toggle-content">
              <FaExchangeAlt /> Transactions
            </span>
            {openMenus.transactions ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          
          {openMenus.transactions && (
            <div className="sidebar-submenu" id="transactions-menu">
              <Link to="/dashboard/sales" className="sidebar-link" onClick={onClose}>
                <FaShoppingCart /> Sales
              </Link>
              <Link to="/dashboard/recent-sales" className="sidebar-link" onClick={onClose}>
                <FaClock /> Recent Sales
              </Link>
              <Link to="/dashboard/purchases" className="sidebar-link" onClick={onClose}>
                <FaBoxOpen /> Purchases
              </Link>
              <Link to="/dashboard/recent-purchases" className="sidebar-link" onClick={onClose}>
                <FaHistory /> Recent Purchases
              </Link>
              <Link to="/dashboard/stock" className="sidebar-link" onClick={onClose}>
                <FaBoxOpen /> Stock
              </Link>
              <Link to="/dashboard/history" className="sidebar-link" onClick={onClose}>
                <FaHistory /> Sales/Purchase History
              </Link>
            </div>
          )}
        </div>

        {/* Settings Section */}
        <div className="sidebar-section">
          <button
            onClick={() => toggleMenu("settings")}
            className="sidebar-toggle"
            aria-expanded={openMenus.settings}
            aria-controls="settings-menu"
          >
            <span className="sidebar-toggle-content">
              <FaCog /> Settings
            </span>
            {openMenus.settings ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          
          {openMenus.settings && (
            <div className="sidebar-submenu" id="settings-menu">
              <Link to="/dashboard/profile" className="sidebar-link" onClick={onClose}>
                <FaUser /> Profile Details
              </Link>
              <Link to="/dashboard/change-password" className="sidebar-link" onClick={onClose}>
                <FaCog /> Change Password
              </Link>
              <Link to="/dashboard/notifications" className="sidebar-link" onClick={onClose}>
                <FaBell /> Notification Preferences
              </Link>
              <button className="sidebar-link theme-toggle" onClick={toggleDarkMode} type="button">
                {darkMode ? <FaSun /> : <FaMoon />}
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          )}
        </div>

        {/* Account Section */}
        <div className="sidebar-section">
          <button
            onClick={() => toggleMenu("account")}
            className="sidebar-toggle"
            aria-expanded={openMenus.account}
            aria-controls="account-menu"
          >
            <span className="sidebar-toggle-content">
              <FaUser /> Account
            </span>
            {openMenus.account ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          
          {openMenus.account && (
            <div className="sidebar-submenu" id="account-menu">
              <button className="sidebar-link logout" onClick={handleLogout} type="button">
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;