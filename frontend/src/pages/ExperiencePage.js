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
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(135deg, #ffecd2, #fcb69f)",
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
        <h2 style={{ marginBottom: "20px", color: "#333" }}>Select Experience</h2>
        <select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "20px",
            fontSize: "16px",
          }}
        >
          <option value="">-- Select Experience --</option>
          <option value="Fresher">Fresher</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Expert">Expert</option>
        </select>
        <button
          onClick={handleNext}
          style={{
            width: "100%",
            padding: "12px",
            background: "#007bff",
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

export default ExperiencePage;
