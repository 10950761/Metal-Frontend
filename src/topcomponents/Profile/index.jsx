import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Added
import "./index.css";

const ProfileDetails = ({ onClose }) => {
  const navigate = useNavigate(); 
  const email = localStorage.getItem("email");
  const username = localStorage.getItem("username");

  const [profilePic, setProfilePic] = useState(
  localStorage.getItem("profileImage") ||
  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
);

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result;
      setProfilePic(imageUrl);
      localStorage.setItem("profileImage", imageUrl); 
    };
    reader.readAsDataURL(file);
  }
};

  const handleClose = () => {
    if (onClose) onClose();
    navigate("/dashboard"); 
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, []);


  return (
    <div className="profile-overlay">
      <div className="profile-popup">
        <div className="avatar-container">
          <img src={profilePic} alt="Profile Avatar" className="avatar" />
          <label htmlFor="profile-upload" className="upload-button">
            Change Photo
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </label>
        </div>

        <h2 className="profile-heading">User Profile</h2>

        <div className="profile-info">
          <p><strong>Username:</strong> {username}</p>
          <p><strong>Email:</strong> {email}</p>
        </div>

        <button onClick={handleClose} className="close-button">Close</button>
      </div>
    </div>
  );
};

export default ProfileDetails;
