import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// The userName prop is already being received correctly.
function Dashboard({ userName, experience, level, sessionId, progress, achievements, userLevel }) {
  const navigate = useNavigate();

  const buttonStyle = {
    padding: "12px 24px",
    fontSize: "16px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
    transition: "all 0.3s ease",
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
        minHeight: "100vh",
      }}
    >
      <Navbar sessionId={sessionId} userName={userName} /> {/* Also pass userName to Navbar */}

      <div
        className="fade-in"
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "40px",
          maxWidth: "800px",
          margin: "40px auto",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        <h1 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
          🎯 Dashboard
        </h1>

        {/* 👇 THIS IS THE UPDATED LINE 👇 */}
        <p style={{ textAlign: "center", color: "#666", marginBottom: "30px" }}>
          Welcome back, <b>{userName || "Guest"}</b> 👋
        </p>

        {/* Quick Info */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          <div>
            <h3>Experience</h3>
            <p>{experience || "Not set"}</p>
          </div>
          <div>
            <h3>Session Level</h3>
            <p>{level || "Not set"}</p>
          </div>
          <div>
            <h3>User Level</h3>
            <p>⭐ {userLevel}</p>
          </div>
        </div>

        {/* Session Progress */}
        <div style={{ marginBottom: "40px" }}>
          <h3 style={{ marginBottom: "10px" }}>Current Session Progress</h3>
          <div
            style={{
              background: "#e0e0e0",
              borderRadius: "20px",
              overflow: "hidden",
              height: "25px",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                background: progress === 100 ? "#28a745" : "#007bff",
                height: "100%",
                transition: "width 0.5s ease-in-out",
              }}
            ></div>
          </div>
          <p style={{ textAlign: "right", marginTop: "5px" }}>
            {progress}% Completed
          </p>
        </div>

        {/* Motivational Tip */}
        <div
          style={{
            marginBottom: "30px",
            padding: "20px",
            borderRadius: "10px",
            background: "#f0f9ff",
            color: "#007bff",
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          💡 Tip: Consistency is key! Complete at least one round every day.
        </div>

        {/* Start Interview Button */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => navigate("/rounds")}
            style={buttonStyle}
            onMouseOver={(e) => (e.target.style.opacity = "0.85")}
            onMouseOut={(e) => (e.target.style.opacity = "1")}
          >
            🚀 Start Interview
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;