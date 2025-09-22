import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LevelPage({ level, setLevel }) {
  const [selectedLevel, setSelectedLevel] = useState(level || "");
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!selectedLevel) {
      alert("⚠️ Please select a difficulty level!");
      return;
    }
    setLevel(selectedLevel);
    navigate("/dashboard");
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
          width: "400px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#333" }}>Select Difficulty</h2>

        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <label style={{ display: "block", marginBottom: "10px" }}>
            <input
              type="radio"
              value="Easy"
              checked={selectedLevel === "Easy"}
              onChange={(e) => setSelectedLevel(e.target.value)}
              style={{ marginRight: "10px" }}
            />
            Easy 🌱
          </label>
          <label style={{ display: "block", marginBottom: "10px" }}>
            <input
              type="radio"
              value="Medium"
              checked={selectedLevel === "Medium"}
              onChange={(e) => setSelectedLevel(e.target.value)}
              style={{ marginRight: "10px" }}
            />
            Medium ⚡
          </label>
          <label style={{ display: "block" }}>
            <input
              type="radio"
              value="Hard"
              checked={selectedLevel === "Hard"}
              onChange={(e) => setSelectedLevel(e.target.value)}
              style={{ marginRight: "10px" }}
            />
            Hard 🔥
          </label>
        </div>

        <button
          onClick={handleContinue}
          style={{
            width: "100%",
            padding: "12px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Continue ➡️
        </button>
      </div>
    </div>
  );
}

export default LevelPage;
