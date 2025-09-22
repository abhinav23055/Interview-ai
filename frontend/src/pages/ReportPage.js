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
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(135deg, #d4fc79, #96e6a1)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
          textAlign: "center",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <h2 style={{ color: "#333", marginBottom: "15px" }}>
          📊 Interview Report
        </h2>
        <p style={{ fontSize: "18px", color: "#555", marginBottom: "20px" }}>
          Here’s your performance summary:
        </p>

        {/* Progress */}
        <h3>Progress: {progress}%</h3>
        <div
          style={{
            background: "#e0e0e0",
            borderRadius: "20px",
            overflow: "hidden",
            height: "20px",
            margin: "10px 0 30px 0",
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

        {/* Achievements */}
        <h3>🏆 Achievements Earned</h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "30px",
          }}
        >
          {achievements.length > 0 ? (
            achievements.map((ach, idx) => (
              <span
                key={idx}
                style={{
                  background: "#f0f9ff",
                  color: "#007bff",
                  padding: "8px 14px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                {ach}
              </span>
            ))
          ) : (
            <p>No new achievements unlocked.</p>
          )}
        </div>

        {/* Feedback */}
        <h3>📌 Feedback</h3>
        <p
          style={{
            fontSize: "16px",
            margin: "20px 0",
            color: "#444",
            fontStyle: "italic",
          }}
        >
          {getFeedback()}
        </p>

        <p style={{ marginTop: "10px" }}>⭐ Your Current Level: {userLevel}</p>

        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "12px 24px",
            marginTop: "20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ⬅ Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default ReportPage;
