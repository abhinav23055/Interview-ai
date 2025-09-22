import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ sessionId }) {
  const navigate = useNavigate();

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
      {/* Logo / App Name */}
      <h2
        style={{ cursor: "pointer", margin: 0 }}
        onClick={() => navigate("/dashboard")}
      >
        🎯 Interview AI
      </h2>

      {/* Navigation Links */}
      <div style={{ display: "flex", gap: "20px" }}>
        <span
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </span>
        <span
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/profile")}
        >
          Profile
        </span>
        <span
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Logout
        </span>
      </div>

      {/* User Info */}
      <div>
        <span style={{ fontSize: "14px", opacity: "0.9" }}>
          {sessionId ? `👤 ${sessionId}` : "Guest"}
        </span>
      </div>
    </div>
  );
}

export default Navbar;
