// src/pages/LevelPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LevelPage({ level, setLevel, sessionId }) {
  const [selectedLevel, setSelectedLevel] = useState(level || "");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (level) setSelectedLevel(level);
  }, [level]);

  const handleContinue = async () => {
    if (!selectedLevel) {
      alert("⚠️ Please select a difficulty level!");
      return;
    }

    setSaving(true);

    if (sessionId) {
      try {
        const response = await fetch(`http://localhost:5000/profile/${sessionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ level: selectedLevel }),
        });
        const data = await response.json();
        if (data.success) {
          setLevel(selectedLevel);
          navigate("/dashboard");
        } else {
          // fallback: still update local and navigate
          setLevel(selectedLevel);
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Failed to save level:", error);
        setLevel(selectedLevel);
        navigate("/dashboard");
      } finally {
        setSaving(false);
      }
    } else {
      setLevel(selectedLevel);
      navigate("/dashboard");
      setSaving(false);
    }
  };

  return (
    <div className="level-container">
      <div className="level-card glass fade-in">
        <h2 className="level-title">Select Difficulty</h2>

        {/* Instruction text added to mirror the Experience page */}
        <p className="text-muted" style={{ marginBottom: "1rem" }}>
          Choose the difficulty level that best matches your preparedness. This will tailor the interview
          questions so they fit your current skill level.
        </p>

        <div className="difficulty-grid">
          {[
            { key: "Easy", emoji: "🌱", title: "Easy", desc: "Warm-up questions" },
            { key: "Medium", emoji: "⚡", title: "Medium", desc: "Real-world scenarios" },
            { key: "Hard", emoji: "🔥", title: "Hard", desc: "Challenging problems" },
          ].map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setSelectedLevel(opt.key)}
              className={`difficulty-card ${selectedLevel === opt.key ? "selected" : ""}`}
              aria-pressed={selectedLevel === opt.key}
            >
              <div className="difficulty-emoji">{opt.emoji}</div>
              <div className="difficulty-content">
                <div className="difficulty-title">{opt.title}</div>
                <div className="difficulty-desc">{opt.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          className="btn btn-primary"
          disabled={!selectedLevel || saving}
          aria-disabled={!selectedLevel || saving}
        >
          {saving ? "Saving…" : "Continue ➡️"}
        </button>
      </div>
    </div>
  );
}

export default LevelPage;
