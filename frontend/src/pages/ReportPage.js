import React from "react";
import { useNavigate } from "react-router-dom";

function ReportPage({ progress, achievements, userLevel }) {
  const navigate = useNavigate();

  // Simple feedback generator
  const getFeedback = () => {
    if (progress < 50) {
      return "⚠️ You need more practice. Focus on fundamentals and try again.";
    } else if (progress < 100) {
      return "👍 Good effort! Keep improving your problem-solving skills.";
    } else {
      return "🎉 Excellent! You completed all rounds successfully!";
    }
  };

  return (
    <div className="report-container">
      <div className="report-card glass fade-in">
        <h2 className="report-title">
          📊 Interview Report
        </h2>
        <p className="report-subtitle">
          Here's your performance summary:
        </p>

        {/* Progress */}
        <div className="progress-section">
          <h3 className="progress-title">Progress: {progress}%</h3>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Achievements */}
        <div className="achievements-section">
          <h3 className="achievements-title">🏆 Achievements Earned</h3>
          <div className="achievements-grid">
            {achievements.length > 0 ? (
              achievements.map((ach, idx) => (
                <span key={idx} className="achievement-badge">
                  {ach}
                </span>
              ))
            ) : (
              <p className="no-achievements">No new achievements unlocked.</p>
            )}
          </div>
        </div>

        {/* Feedback */}
        <div className="feedback-section">
          <h3 className="feedback-title">📌 Feedback</h3>
          <p className="feedback-text">
            {getFeedback()}
          </p>
          <p className="level-text">⭐ Your Current Level: {userLevel}</p>
        </div>

        {/* Back Button */}
        <div className="report-actions">
          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn-primary"
          >
            ⬅ Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportPage;
