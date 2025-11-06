import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function ProfilePage({ userName, sessionId, experience, level, userLevel, progress, achievements, setExperience, setLevel }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: userName || "",
    experience: experience || "",
    level: level || "",
  });
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    totalQuestions: 0,
    avgEyeContact: 0,
    avgCorrectness: 0,
    totalWords: 0,
    improvementTrend: [],
  });

  // Load interview history from localStorage
  useEffect(() => {
    const loadHistory = () => {
      try {
        const historyKey = `interviewHistory_${sessionId}`;
        const stored = localStorage.getItem(historyKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          setInterviewHistory(parsed);
          
          // Calculate stats from history
          if (parsed.length > 0) {
            const totalQs = parsed.reduce((sum, session) => sum + (session.questionsAnswered || 0), 0);
            const totalWords = parsed.reduce((sum, session) => sum + (session.totalWords || 0), 0);
            const avgEyeContact = parsed.reduce((sum, session) => sum + (session.avgEyeContact || 0), 0) / parsed.length;
            const avgCorrectness = parsed.reduce((sum, session) => sum + (session.avgCorrectness || 0), 0) / parsed.length;
            
            setStats({
              totalInterviews: parsed.length,
              totalQuestions: totalQs,
              avgEyeContact: Math.round(avgEyeContact),
              avgCorrectness: Math.round(avgCorrectness),
              totalWords: totalWords,
              improvementTrend: parsed.slice(-7).map(s => ({
                date: s.date || new Date().toLocaleDateString(),
                score: s.avgCorrectness || 0,
              })),
            });
          }
        }
      } catch (e) {
        console.error("Failed to load interview history:", e);
      }
    };
    loadHistory();
  }, [sessionId]);

  // Save interview session to history (called from AgentPage)
  useEffect(() => {
    const handleInterviewComplete = (event) => {
      const sessionData = event.detail;
      const historyKey = `interviewHistory_${sessionId}`;
      const existing = JSON.parse(localStorage.getItem(historyKey) || "[]");
      const newSession = {
        ...sessionData,
        date: new Date().toISOString(),
        id: Date.now(),
      };
      existing.unshift(newSession);
      localStorage.setItem(historyKey, JSON.stringify(existing.slice(0, 50))); // Keep last 50
      setInterviewHistory(existing);
    };

    window.addEventListener("interviewComplete", handleInterviewComplete);
    return () => window.removeEventListener("interviewComplete", handleInterviewComplete);
  }, [sessionId]);

  const handleSaveProfile = async () => {
    if (editForm.name.trim()) {
      try {
        const response = await fetch(`http://localhost:5000/profile/${sessionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editForm.name,
            experience: editForm.experience,
            level: editForm.level,
          }),
        });
        const data = await response.json();
        if (data.success) {
          if (setExperience) setExperience(editForm.experience);
          if (setLevel) setLevel(editForm.level);
          setIsEditing(false);
          alert("Profile updated successfully!");
        }
      } catch (error) {
        console.error("Failed to update profile:", error);
        alert("Failed to update profile. Please try again.");
      }
    }
  };

  const skillAreas = useMemo(() => {
    const skills = {};
    interviewHistory.forEach(session => {
      session.answers?.forEach(answer => {
        const question = answer.question?.toLowerCase() || "";
        if (question.includes("javascript") || question.includes("react") || question.includes("node")) {
          skills["JavaScript/React"] = (skills["JavaScript/React"] || 0) + 1;
        }
        if (question.includes("python") || question.includes("django") || question.includes("flask")) {
          skills["Python"] = (skills["Python"] || 0) + 1;
        }
        if (question.includes("database") || question.includes("sql") || question.includes("mongodb")) {
          skills["Database"] = (skills["Database"] || 0) + 1;
        }
        if (question.includes("api") || question.includes("rest") || question.includes("microservice")) {
          skills["API Design"] = (skills["API Design"] || 0) + 1;
        }
        if (question.includes("system design") || question.includes("architecture") || question.includes("scalability")) {
          skills["System Design"] = (skills["System Design"] || 0) + 1;
        }
        if (question.includes("algorithm") || question.includes("data structure") || question.includes("complexity")) {
          skills["Algorithms"] = (skills["Algorithms"] || 0) + 1;
        }
      });
    });
    return Object.entries(skills).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [interviewHistory]);

  return (
    <div className="profile-container">
      <div className="container">
        <div className="profile-card glass fade-in">
          <div className="profile-header">
            <div className="profile-avatar">
              <span className="avatar-icon-large">👤</span>
            </div>
            <div className="profile-info">
              <h1 className="profile-title">{userName || "User"}</h1>
              <p className="profile-subtitle">Level {userLevel} • {experience || "Not Set"}</p>
              <div className="profile-badges">
                <span className="badge">⭐ {userLevel}</span>
                <span className="badge">📊 {progress}% Complete</span>
                {achievements?.length > 0 && <span className="badge">🏆 {achievements.length} Achievements</span>}
              </div>
            </div>
            <button className="btn btn-secondary" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "✏️ Edit Profile"}
            </button>
          </div>

          {isEditing && (
            <div className="edit-profile-form">
              <h3>Edit Profile</h3>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Your name"
                />
              </div>
              <div className="form-group">
                <label>Experience Level</label>
                <select
                  className="form-input"
                  value={editForm.experience}
                  onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                >
                  <option value="">Select Experience</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <div className="form-group">
                <label>Preferred Difficulty</label>
                <select
                  className="form-input"
                  value={editForm.level}
                  onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
                >
                  <option value="">Select Difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <button className="btn btn-primary" onClick={handleSaveProfile}>Save Changes</button>
            </div>
          )}

          <div className="profile-tabs">
            <button
              className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              📊 Overview
            </button>
            <button
              className={`tab-button ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              📝 Interview History
            </button>
            <button
              className={`tab-button ${activeTab === "analytics" ? "active" : ""}`}
              onClick={() => setActiveTab("analytics")}
            >
              📈 Analytics
            </button>
            <button
              className={`tab-button ${activeTab === "achievements" ? "active" : ""}`}
              onClick={() => setActiveTab("achievements")}
            >
              🏆 Achievements
            </button>
          </div>

          <div className="profile-content">
            {activeTab === "overview" && (
              <div className="overview-tab">
                <div className="stats-grid-large">
                  <div className="stat-card-large">
                    <div className="stat-icon-large">🎯</div>
                    <div className="stat-content-large">
                      <h3>Total Interviews</h3>
                      <p className="stat-value-large">{stats.totalInterviews}</p>
                      <span className="stat-subtitle">Completed sessions</span>
                    </div>
                  </div>
                  <div className="stat-card-large">
                    <div className="stat-icon-large">❓</div>
                    <div className="stat-content-large">
                      <h3>Questions Answered</h3>
                      <p className="stat-value-large">{stats.totalQuestions}</p>
                      <span className="stat-subtitle">Total questions</span>
                    </div>
                  </div>
                  <div className="stat-card-large">
                    <div className="stat-icon-large">👁️</div>
                    <div className="stat-content-large">
                      <h3>Avg Eye Contact</h3>
                      <p className="stat-value-large">{stats.avgEyeContact}%</p>
                      <span className="stat-subtitle">Maintained focus</span>
                    </div>
                  </div>
                  <div className="stat-card-large">
                    <div className="stat-icon-large">✅</div>
                    <div className="stat-content-large">
                      <h3>Avg Correctness</h3>
                      <p className="stat-value-large">{stats.avgCorrectness}%</p>
                      <span className="stat-subtitle">Answer quality</span>
                    </div>
                  </div>
                </div>

                <div className="skills-section">
                  <h3>Most Practiced Skills</h3>
                  <div className="skills-grid">
                    {skillAreas.length > 0 ? (
                      skillAreas.map(([skill, count]) => (
                        <div key={skill} className="skill-item">
                          <span className="skill-name">{skill}</span>
                          <div className="skill-bar">
                            <div
                              className="skill-fill"
                              style={{ width: `${Math.min((count / stats.totalQuestions) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="skill-count">{count} questions</span>
                        </div>
                      ))
                    ) : (
                      <p className="no-data">Start practicing to see your skills!</p>
                    )}
                  </div>
                </div>

                <div className="quick-actions">
                  <h3>Quick Actions</h3>
                  <div className="actions-grid">
                    <button className="action-card" onClick={() => navigate("/agent")}>
                      <span className="action-icon">🤖</span>
                      <span className="action-text">Start AI Interview</span>
                    </button>
                    <button className="action-card" onClick={() => navigate("/rounds")}>
                      <span className="action-icon">🚀</span>
                      <span className="action-text">Practice Round</span>
                    </button>
                    <button className="action-card" onClick={() => navigate("/dashboard")}>
                      <span className="action-icon">📊</span>
                      <span className="action-text">View Dashboard</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div className="history-tab">
                <h3>Interview History</h3>
                {interviewHistory.length > 0 ? (
                  <div className="history-list">
                    {interviewHistory.map((session) => (
                      <div key={session.id} className="history-item">
                        <div className="history-header">
                          <div>
                            <strong>{new Date(session.date).toLocaleDateString()}</strong>
                            <span className="history-meta">
                              {session.questionsAnswered || 0} questions • {session.totalWords || 0} words
                            </span>
                          </div>
                          <div className="history-scores">
                            <span className="score-badge">👁️ {session.avgEyeContact || 0}%</span>
                            <span className="score-badge">✅ {session.avgCorrectness || 0}%</span>
                          </div>
                        </div>
                        {session.answers && session.answers.length > 0 && (
                          <div className="history-answers">
                            {session.answers.slice(0, 2).map((ans, idx) => (
                              <div key={idx} className="answer-preview">
                                <strong>Q{idx + 1}:</strong> {ans.question?.substring(0, 80)}...
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-data">
                    <p>No interview history yet. Start your first interview to see it here!</p>
                    <button className="btn btn-primary" onClick={() => navigate("/agent")}>
                      Start Interview
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="analytics-tab">
                <h3>Performance Analytics</h3>
                <div className="analytics-grid">
                  <div className="analytics-card">
                    <h4>Improvement Trend</h4>
                    {stats.improvementTrend.length > 0 ? (
                      <div className="trend-chart">
                        {stats.improvementTrend.map((point, idx) => (
                          <div key={idx} className="trend-bar-container">
                            <div
                              className="trend-bar"
                              style={{ height: `${point.score}%` }}
                              title={`${point.date}: ${point.score}%`}
                            />
                            <span className="trend-label">{point.date.split('/')[0]}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-data">Complete more interviews to see trends</p>
                    )}
                  </div>
                  <div className="analytics-card">
                    <h4>Performance Metrics</h4>
                    <div className="metrics-list">
                      <div className="metric-item">
                        <span>Total Words Spoken</span>
                        <strong>{stats.totalWords.toLocaleString()}</strong>
                      </div>
                      <div className="metric-item">
                        <span>Average Session Length</span>
                        <strong>{stats.totalInterviews > 0 ? Math.round(stats.totalQuestions / stats.totalInterviews) : 0} questions</strong>
                      </div>
                      <div className="metric-item">
                        <span>Consistency Score</span>
                        <strong>{stats.avgCorrectness > 70 ? "Excellent" : stats.avgCorrectness > 50 ? "Good" : "Needs Improvement"}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "achievements" && (
              <div className="achievements-tab">
                <h3>Your Achievements</h3>
                {achievements && achievements.length > 0 ? (
                  <div className="achievements-grid-large">
                    {achievements.map((ach, idx) => (
                      <div key={idx} className="achievement-card">
                        <span className="achievement-icon">🏆</span>
                        <span className="achievement-text">{ach}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-data">
                    <p>No achievements unlocked yet. Complete interviews to earn achievements!</p>
                  </div>
                )}
                <div className="achievement-progress">
                  <h4>Progress to Next Level</h4>
                  <div className="progress-bar-large">
                    <div
                      className="progress-fill-large"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p>{progress}% complete • Level {userLevel}</p>
                </div>
              </div>
            )}
          </div>

          <div className="profile-footer">
            <button className="btn btn-ghost" onClick={() => navigate("/dashboard")}>
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
