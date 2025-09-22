import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// This component is now simpler. It doesn't fetch its own data.
// It just displays the props it receives from App.js.
function ProfilePage({ sessionId, experience, userLevel, progress, achievements }) {
  const navigate = useNavigate();

  const buttonStyle = {
    padding: "12px 24px",
    fontSize: "16px",
    background: "linear-gradient(135deg, #ff758c, #ff7eb3)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
    transition: "all 0.3s ease",
    marginTop: "20px",
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(135deg, #fbc2eb, #a6c1ee)",
        minHeight: "100vh",
      }}
    >
      <Navbar sessionId={sessionId} />

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
          👤 Profile
        </h1>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "30px" }}>
          Welcome, <b>{sessionId}</b>
        </p>

        {/* Lifetime Stats - Now using props from App.js */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          <div>
            <h3>Total Progress</h3>
            <p>{progress || 0}%</p>
          </div>
          <div>
            <h3>Experience</h3>
            <p>{experience || "Not Set"}</p>
          </div>
          <div>
            <h3>User Level</h3>
            <p>⭐ {userLevel}</p>
          </div>
        </div>

        {/* Achievements */}
        <div style={{ marginBottom: "40px" }}>
          <h3 style={{ marginBottom: "15px" }}>🏆 Achievements</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {achievements && achievements.length > 0 ? (
              achievements.map((ach, idx) => (
                <span key={idx} style={{ background: "#fff0f5", color: "#d63384", padding: "8px 14px", borderRadius: "20px", fontSize: "14px", boxShadow: "0px 2px 6px rgba(0,0,0,0.1)" }}>
                  {ach}
                </span>
              ))
            ) : (
              <p>No achievements unlocked yet.</p>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div style={{ textAlign: "center" }}>
          <button style={buttonStyle} onClick={() => navigate("/dashboard")}>
            ⬅ Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;