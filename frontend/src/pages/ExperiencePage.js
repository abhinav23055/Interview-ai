import React from "react";
import { useNavigate } from "react-router-dom";

function ExperiencePage({ experience, setExperience, sessionId }) {
  const navigate = useNavigate();

  const saveExperience = async (exp) => {
    if (sessionId) {
      try {
        const response = await fetch(`http://localhost:5000/profile/${sessionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ experience: exp }),
        });
        const data = await response.json();
        if (data.success) {
          setExperience(exp);
        }
      } catch (error) {
        console.error("Failed to save experience:", error);
      }
    } else {
      setExperience(exp);
    }
  };

  const handleNext = () => {
    if (experience) {
      navigate("/level");
    } else {
      alert("⚠️ Please select your experience level!");
    }
  };

  return (
    <div className="experience-container">
      <div className="experience-card glass fade-in">
        <h2 className="experience-title">Select Experience</h2>
        <div className="experience-options">
          {[
            { key: "Fresher", emoji: "🌟", label: "Fresher" },
            { key: "Intermediate", emoji: "🚀", label: "Intermediate" },
            { key: "Expert", emoji: "🧠", label: "Expert" },
          ].map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => saveExperience(opt.key)}
              className={`chip-option ${experience === opt.key ? "selected" : ""}`}
              aria-pressed={experience === opt.key}
            >
              <span className="chip-emoji">{opt.emoji}</span>
              <span className="chip-label">{opt.label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={handleNext}
          className="btn btn-primary"
        >
          Continue ➡️
        </button>
      </div>
    </div>
  );
}

export default ExperiencePage;
