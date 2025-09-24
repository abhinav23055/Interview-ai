import React from "react";
import { useNavigate } from "react-router-dom";

function ExperiencePage({ experience, setExperience }) {
  const navigate = useNavigate();

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
        <div className="form-group">
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="form-input"
          >
            <option value="">-- Select Experience --</option>
            <option value="Fresher">Fresher</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
          </select>
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
