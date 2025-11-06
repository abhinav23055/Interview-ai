import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RolePage({ role, setRole, sessionId }) {
  const [selectedRole, setSelectedRole] = useState(role || "");
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!selectedRole) {
      alert("⚠️ Please select a role!");
      return;
    }
    
    if (sessionId) {
      try {
        const response = await fetch(`http://localhost:5000/profile/${sessionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: selectedRole }),
        });
        const data = await response.json();
        if (data.success) {
          setRole(selectedRole);
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Failed to save role:", error);
        setRole(selectedRole);
        navigate("/dashboard");
      }
    } else {
      setRole(selectedRole);
      navigate("/dashboard");
    }
  };

  const roles = [
    { key: "Software Engineer", emoji: "💻", desc: "Full-stack, Backend, Frontend development" },
    { key: "Data Scientist", emoji: "📊", desc: "ML, AI, Data analysis and modeling" },
    { key: "DevOps Engineer", emoji: "⚙️", desc: "CI/CD, Cloud, Infrastructure" },
    { key: "Product Manager", emoji: "📱", desc: "Product strategy and management" },
    { key: "QA Engineer", emoji: "🔍", desc: "Testing, Quality assurance" },
    { key: "UI/UX Designer", emoji: "🎨", desc: "Design, User experience" },
    { key: "Mobile Developer", emoji: "📱", desc: "iOS, Android development" },
    { key: "System Architect", emoji: "🏗️", desc: "System design and architecture" },
  ];

  return (
    <div className="role-container">
      <div className="role-card glass fade-in">
        <h2 className="role-title">Select Your Role</h2>
        <p className="role-subtitle">Choose the role you're preparing for. Questions will be tailored accordingly.</p>

        <div className="role-grid">
          {roles.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setSelectedRole(opt.key)}
              className={`role-option ${selectedRole === opt.key ? "selected" : ""}`}
              aria-pressed={selectedRole === opt.key}
            >
              <div className="role-emoji">{opt.emoji}</div>
              <div className="role-content">
                <div className="role-name">{opt.key}</div>
                <div className="role-desc">{opt.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="role-actions">
          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn-secondary"
          >
            Skip for now
          </button>
          <button
            onClick={handleContinue}
            className="btn btn-primary"
          >
            Continue ➡️
          </button>
        </div>
      </div>
    </div>
  );
}

export default RolePage;

