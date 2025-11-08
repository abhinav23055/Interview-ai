import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ExperiencePage({ experience, setExperience, sessionId }) {
  const navigate = useNavigate();
  const [selectedExperience, setSelectedExperience] = useState(experience || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (experience) setSelectedExperience(experience);
  }, [experience]);

  const EXPERIENCES = [
    { key: "Fresher", emoji: "🌱", title: "Fresher", desc: "New to interviews or starting your journey" },
    { key: "Intermediate", emoji: "🚀", title: "Intermediate", desc: "1–3 years of experience" },
    { key: "Expert", emoji: "🧠", title: "Expert", desc: "Experienced professional or senior-level" },
  ];

  const handleSelect = (key) => {
    setSelectedExperience(key);
    setError("");
  };

  const handleContinue = async () => {
    if (!selectedExperience) {
      setError("Please select your experience level before continuing.");
      return;
    }

    setSaving(true);

    const API =
      import.meta?.env?.VITE_API_URL ||
      process.env?.REACT_APP_API_URL ||
      "http://localhost:5000";

    try {
      if (sessionId) {
        const res = await fetch(`${API}/profile/${sessionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ experience: selectedExperience }),
        });

        const data = await res.json().catch(() => null);
        if (!res.ok || (data && data.success === false)) {
          throw new Error(data?.message || `Failed to save experience (${res.status})`);
        }
      }

      setExperience(selectedExperience);
      navigate("/level");
    } catch (err) {
      console.error("Failed to save experience:", err);
      setExperience(selectedExperience);
      navigate("/level");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="level-container">
      <div className="level-card glass fade-in" role="region" aria-label="Select Experience">
        <h2 className="level-title">Select Experience</h2>
        <p className="text-muted">Choose your current experience level to personalize your interview questions.</p>

        <div className="difficulty-grid">
          {EXPERIENCES.map((exp) => (
            <button
              key={exp.key}
              type="button"
              onClick={() => handleSelect(exp.key)}
              className={`difficulty-card ${selectedExperience === exp.key ? "selected" : ""}`}
              aria-pressed={selectedExperience === exp.key}
            >
              <div className="difficulty-emoji">{exp.emoji}</div>
              <div className="difficulty-content">
                <div className="difficulty-title">{exp.title}</div>
                <div className="difficulty-desc">{exp.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {error && <p className="text-muted" style={{ color: "var(--warning-color)" }}>{error}</p>}

        <button
          onClick={handleContinue}
          className="btn btn-primary"
          disabled={!selectedExperience || saving}
          aria-disabled={!selectedExperience || saving}
        >
          {saving ? "Saving…" : "Continue ➡️"}
        </button>
      </div>
    </div>
  );
}

export default ExperiencePage;
