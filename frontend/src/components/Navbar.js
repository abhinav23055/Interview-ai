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
    <div
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
      }}
    >
      <h2 style={{ cursor: "pointer", margin: 0 }} onClick={() => navigate("/dashboard")}>
        🎯 Interview AI
      </h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <span style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
          Dashboard
        </span>
        <span style={{ cursor: "pointer" }} onClick={() => navigate("/profile")}>
          Profile
        </span>
        <span style={{ cursor: "pointer" }} onClick={handleLogout}>
          Logout
        </span>
      </div>

      <div>
        <span style={{ fontSize: "14px", opacity: "0.9" }}>
          {/* 2. Display the userName if it exists, otherwise show Guest */}
          {userName ? `👤 ${userName}` : "Guest"}
        </span>
      </div>
    </div>
  );
}

export default Navbar;