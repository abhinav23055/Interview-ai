import React from "react";
import { useNavigate } from "react-router-dom";
// Navbar import removed so App.js controls the navbar

// The userName prop is already being received correctly.
function Dashboard({ userName, experience, level, role, sessionId, progress, achievements, userLevel, setExperience, setLevel, setRole }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="container">
        <div className="dashboard-header fade-in">
          <div className="welcome-section">
            <h1 className="dashboard-title">
              <span className="dashboard-icon">🎯</span>
              Dashboard
            </h1>
            <p className="welcome-message">
              Welcome back, <span className="user-highlight">{userName || "Guest"}</span> 👋
            </p>
            <p className="dashboard-subtitle">
              Ready to ace your next interview? Let's get started!
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid fade-in">
          <div className="stat-card">
            <div className="stat-icon">💼</div>
            <div className="stat-content">
              <h3 className="stat-title">Experience</h3>
              <p className="stat-value">{experience || "Not set"}</p>
              <button
                onClick={() => navigate("/experience")}
                className="btn btn-ghost btn-small"
                style={{ marginTop: "8px", fontSize: "0.85rem" }}
              >
                Change
              </button>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🎚️</div>
            <div className="stat-content">
              <h3 className="stat-title">Difficulty</h3>
              <p className="stat-value">{level || "Not set"}</p>
              <button
                onClick={() => navigate("/level")}
                className="btn btn-ghost btn-small"
                style={{ marginTop: "8px", fontSize: "0.85rem" }}
              >
                Change
              </button>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👔</div>
            <div className="stat-content">
              <h3 className="stat-title">Role</h3>
              <p className="stat-value">{role || "Not set"}</p>
              <button
                onClick={() => navigate("/role")}
                className="btn btn-ghost btn-small"
                style={{ marginTop: "8px", fontSize: "0.85rem" }}
              >
                Change
              </button>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3 className="stat-title">User Level</h3>
              <p className="stat-value">Level {userLevel}</p>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="progress-section fade-in">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="progress-icon">📈</span>
                Session Progress
              </h3>
            </div>
            <div className="card-body">
              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="progress-info">
                  <span className="progress-text">
                    {progress}% Complete
                  </span>
                  <span className="progress-emoji">
                    {progress === 100 ? "🎉" : progress >= 75 ? "🔥" : progress >= 50 ? "💪" : "🚀"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Tip */}
        <div className="tip-section fade-in">
          <div className="tip-card">
            <div className="tip-icon">💡</div>
            <div className="tip-content">
              <h4 className="tip-title">Daily Tip</h4>
              <p className="tip-text">
                Consistency is key! Complete at least one round every day to build confidence and improve your skills.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="actions-section fade-in">
          <div className="action-buttons">
            <button
              onClick={() => navigate("/agent")}
              className="btn btn-primary action-button"
            >
              <span className="btn-icon">🤖</span>
              <span>Start AI Agent Interview</span>
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="btn btn-secondary action-button"
            >
              <span className="btn-icon">👤</span>
              <span>View Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
