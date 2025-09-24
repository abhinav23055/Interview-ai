import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// This component is now simpler. It doesn't fetch its own data.
// It just displays the props it receives from App.js.
function ProfilePage({ userName, sessionId, experience, userLevel, progress, achievements }) {
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
    <div className="profile-container">
      <Navbar sessionId={sessionId} userName={userName}/>

      <div className="container">
        <div className="profile-card glass fade-in">
          <h1 className="profile-title">
            👤 Profile
          </h1>
          
          <p className="profile-welcome">
            Welcome, <span className="user-highlight">{userName}</span>
          </p>

          {/* Lifetime Stats */}
          <div className="profile-stats">
            <div className="profile-stat">
              <h3>Total Progress</h3>
              <p>{progress || 0}%</p>
            </div>
            <div className="profile-stat">
              <h3>Experience</h3>
              <p>{experience || "Not Set"}</p>
            </div>
            <div className="profile-stat">
              <h3>User Level</h3>
              <p>⭐ {userLevel}</p>
            </div>
          </div>

          {/* Achievements */}
          <div className="achievements-section">
            <h3 className="achievements-title">🏆 Achievements</h3>
            <div className="achievements-grid">
              {achievements && achievements.length > 0 ? (
                achievements.map((ach, idx) => (
                  <span key={idx} className="achievement-badge">
                    {ach}
                  </span>
                ))
              ) : (
                <p className="no-achievements">No achievements unlocked yet.</p>
              )}
            </div>
          </div>

          {/* Back Button */}
          <div className="profile-actions">
            <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>
              ⬅ Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;