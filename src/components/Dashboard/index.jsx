// Dashboard.jsx
import React, { useState, useEffect, } from "react";
import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import "./index.css";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [username, setUsername] = useState("User");
  const [,setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate('/login');
        return;
      }

    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

      try {
        const res = await axios.get("https://metal-backend-1.onrender.com/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);  
      } catch (err) {
        alert("Failed to fetch profile");
        localStorage.clear();
        navigate('/login');
      }
    };

    fetchUserProfile();
  }, [navigate]);


  return (
    <div className="dashboard">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)}  setUser={setUser}/>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <div className="backdrop" onClick={() => setSidebarOpen(false)}></div>
      )}

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome , {username} </h1>
        </div>
        <Outlet />
        <div className="dashboard-cards">{/* dashboard widgets */}</div>
      </main>
    </div>
  );
};

export default Dashboard;
