import React from "react";
import { useNavigate } from "react-router-dom";

// 1. Accept 'userName' as a new prop
function Navbar({ sessionId, userName }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload(); 
  };

  return (
    <nav className="navbar fade-in">
      <div className="navbar-brand" onClick={() => navigate("/dashboard")}>
        <span className="navbar-icon">🎯</span>
        <span className="navbar-title">Interview AI</span>
      </div>

      <div className="navbar-menu">
        <div className="navbar-item" onClick={() => navigate("/dashboard")}>
          <span className="navbar-item-icon">📊</span>
          <span>Dashboard</span>
        </div>
        <div className="navbar-item" onClick={() => navigate("/profile")}>
          <span className="navbar-item-icon">👤</span>
          <span>Profile</span>
        </div>
        <div className="navbar-item logout" onClick={handleLogout}>
          <span className="navbar-item-icon">🚪</span>
          <span>Logout</span>
        </div>
      </div>

      <div className="navbar-user">
        <div className="user-avatar">
          <span className="avatar-icon">👤</span>
        </div>
        <span className="user-name">
          {userName || "Guest"}
        </span>
      </div>
    </nav>
  );
}

export default Navbar;