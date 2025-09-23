import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

// Component Imports
import ProtectedRoute from "./components/ProtectedRoute";

// Page Imports
import ExperiencePage from "./pages/ExperiencePage";
import LevelPage from "./pages/LevelPage";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import RoundsPage from "./pages/RoundsPage";
import ReportPage from "./pages/ReportPage";

function App() {
  // --- Global State ---
  const [experience, setExperience] = useState("");
  const [level, setLevel] = useState("");
  const [progress, setProgress] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [userLevel, setUserLevel] = useState(1);
  const [userName, setUserName] = useState(""); // 👈 ADD THIS LINE
  const [sessionId, setSessionId] = useState(localStorage.getItem("userId") || "");

  // --- Automatically fetch user data on login or page refresh ---
  useEffect(() => {
    if (!sessionId) return; // Don't fetch if no user is logged in

    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/profile/${sessionId}`);
        const data = await response.json();

        if (data.success) {
          const user = data.user;
          // Update the app's global state with data from the database
          setExperience(user.experience || "");
          setLevel(user.level || "");
          setProgress(user.progress || 0);
          setAchievements(user.achievements || []);
          setUserLevel(user.userLevel || 1);
          setUserName(user.name || ""); // 👈 ADD THIS LINE
        }
      } catch (error) {
        console.error("Failed to fetch user data on app load:", error);
      }
    };

    fetchUserData();
  }, [sessionId]);

  return (
    <Routes>
      {/* --- Public Route (Visible to everyone) --- */}
      <Route 
        path="/" 
        element={<LoginPage setSessionId={setSessionId} setUserName={setUserName} />} // 👈 UPDATE THIS LINE
      />

      {/* --- Protected Routes (Visible only to logged-in users) --- */}
      <Route
        path="/experience"
        element={
          <ProtectedRoute sessionId={sessionId}>
            <ExperiencePage experience={experience} setExperience={setExperience} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/level"
        element={
          <ProtectedRoute sessionId={sessionId}>
            <LevelPage level={level} setLevel={setLevel} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute sessionId={sessionId}>
            <Dashboard
              userName={userName} // 👈 ADD THIS LINE
              experience={experience}
              level={level}
              sessionId={sessionId}
              progress={progress}
              achievements={achievements}
              userLevel={userLevel}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute sessionId={sessionId}>
            <ProfilePage
              userName={userName} // 👈 ADD THIS LINE
              sessionId={sessionId}
              experience={experience}
              userLevel={userLevel}
              progress={progress}
              achievements={achievements}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rounds"
        element={
          <ProtectedRoute sessionId={sessionId}>
            <RoundsPage
              sessionId={sessionId}
              experience={experience}
              level={level}
              setProgress={setProgress}
              progress={progress}
              setAchievements={setAchievements}
              achievements={achievements}
              userLevel={userLevel}
              setUserLevel={setUserLevel}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/report"
        element={
          <ProtectedRoute sessionId={sessionId}>
            <ReportPage
              progress={progress}
              achievements={achievements}
              userLevel={userLevel}
            />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;