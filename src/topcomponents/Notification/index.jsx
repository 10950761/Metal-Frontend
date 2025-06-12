import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import API_BASE_URL from "../../api/config";

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`${API_BASE_URL}/api/notifications/unread-count`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        console.log("🔔 Notification Count:", data.count); 
        setUnreadCount(data.count || 0);
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };

    fetchNotifications();

    const handleBellUpdate = () => {
      console.log("🔔 Bell updated");
      fetchNotifications();
    };

    window.addEventListener("bellUpdated", handleBellUpdate);

    return () => {
      window.removeEventListener("bellUpdated", handleBellUpdate);
    };
  }, []);

  return (
    <div className="icon-wrapper notification-bell">
      <FaBell />
      <span className="notification-badge">{unreadCount}</span> 
    </div>
  );
};

export default NotificationBell;
