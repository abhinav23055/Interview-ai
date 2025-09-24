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
    <div className="level-container">
      <div className="level-card glass fade-in">
        <h2 className="level-title">Select Difficulty</h2>

        <div className="difficulty-options">
          <label className="radio-option">
            <input
              type="radio"
              value="Easy"
              checked={selectedLevel === "Easy"}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="radio-input"
            />
            <span className="radio-label">Easy 🌱</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              value="Medium"
              checked={selectedLevel === "Medium"}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="radio-input"
            />
            <span className="radio-label">Medium ⚡</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              value="Hard"
              checked={selectedLevel === "Hard"}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="radio-input"
            />
            <span className="radio-label">Hard 🔥</span>
          </label>
        </div>

        <button
          onClick={handleContinue}
          className="btn btn-primary"
        >
          Continue ➡️
        </button>
      </div>
    </div>
  );
}

export default LevelPage;
