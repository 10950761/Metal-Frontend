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
  FaPlus,
  FaHistory,
  FaFileExport,
  FaExchangeAlt,
  FaClock,
} from "react-icons/fa";
import "./index.css";

function Sidebar({ isOpen, onClose }) {
  const [openMenus, setOpenMenus] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [lastLogin, setLastLogin] = useState(null);
  const [, setUser] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // You can add logic here to apply dark/light theme to the entire app
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
    navigate("/login");
  };
  // Get last login time from localStorage
  useEffect(() => {
    const storedLogin = localStorage.getItem("lastLogin");
    if (storedLogin) {
      setLastLogin(new Date(storedLogin).toLocaleString());
    } else {
      setLastLogin("Unknown");
    }
  }, []);

  return (
    <aside
      className={`custom-sidebar ${darkMode ? "dark-mode" : ""} ${
        isOpen ? "open" : ""
      }`}
    >
      <div className="sidebar-close-button" onClick={onClose}>
        ✖
      </div>
      <nav className="sidebar-nav">
        {/* Dashboard */}
        <div className="sidebar-section">
          <button
            onClick={() => toggleMenu("dashboard")}
            className="sidebar-toggle"
          >
            <span>
              <FaTachometerAlt /> Overviews
            </span>
            {openMenus.dashboard ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {openMenus.dashboard && (
            <div className="sidebar-submenu">
              <Link to="/dashboard/stock-summary" onClick={onClose}>Stock Overview</Link>
              <a href="#">Purchase Analytics</a>
              <a href="#">Sales Analytics</a>
              <Link to = "/dashboard/revenue-summary" onClick={onClose}>Revenue Summary</Link>
            </div>
          )}
        </div>

        {/* Transactions */}
        <div className="sidebar-section">
          <button
            onClick={() => toggleMenu("transactions")}
            className="sidebar-toggle"
          >
            <span>
              <FaChartLine /> Transactions
            </span>
            {openMenus.transactions ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {openMenus.transactions && (
            <div className="sidebar-submenu">
              <Link to="/dashboard/sales" onClick={onClose}>Sales</Link>
              <Link to="/dashboard/recent-sales" onClick={onClose}>Recent Sales</Link>
              <Link to="/dashboard/purchases" onClick={onClose}>Purchases</Link>
              <Link to="/dashboard/recent-purchases" onClick={onClose}> Recent Purchases </Link>
              <Link to="/dashboard/stock" onClick={onClose}>Stock</Link>
              <Link to="/dashboard/history" onClick={onClose}>Sales/Purchase History</Link>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="sidebar-section">
          <button
            onClick={() => toggleMenu("settings")}
            className="sidebar-toggle"
          >
            <span>
              <FaCog /> Settings
            </span>
            {openMenus.settings ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {openMenus.settings && (
            <div className="sidebar-submenu">
              <Link to="/dashboard/profile" className="nav-link" onClick={onClose}>
                <FaUser /> Profile Details
              </Link>
              <a href="#">
                {" "}
                <FaCog />
                Change Password
              </a>
              <a href="#">
                <FaBell /> Notification Preferences
              </a>
              <button className="sidebar-link" onClick={toggleDarkMode}>
                {darkMode ? <FaSun /> : <FaMoon />}
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          )}
        </div>

        {/* Account */}
        <div className="sidebar-section">
          <button
            onClick={() => toggleMenu("account")}
            className="sidebar-toggle"
          >
            <span>
              <FaUser /> Account
            </span>
            {openMenus.account ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {openMenus.account && (
            <div className="sidebar-submenu">
              <button className="sidebar-link logout" onClick={logout}>
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
