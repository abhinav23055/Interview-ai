// frontend/src/App.js
import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

// Component Imports
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// Page Imports
import LandingPage from "./pages/LandingPage";
import ExperiencePage from "./pages/ExperiencePage";
import LevelPage from "./pages/LevelPage";
import RolePage from "./pages/RolePage";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import RoundsPage from "./pages/RoundsPage";
import ReportPage from "./pages/ReportPage";
import AgentPage from "./pages/AgentPage";

function App() {
  const location = useLocation();
  // --- Global State ---
  const [experience, setExperience] = useState("");
  const [level, setLevel] = useState("");
  const [role, setRole] = useState("");
  const [progress, setProgress] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [userLevel, setUserLevel] = useState(1);
  const [userName, setUserName] = useState("");
  const [sessionId, setSessionId] = useState(localStorage.getItem("userId") || "");
  
  // Hide navbar on login/signup page, experience, level, and role pages
  const hideNavbarPaths = ["/", "/login", "/experience", "/level", "/role"];
  const showNavbar = sessionId && !hideNavbarPaths.includes(location.pathname);

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
          setRole(user.role || "");
          setProgress(user.progress || 0);
          setAchievements(user.achievements || []);
          setUserLevel(user.userLevel || 1);
          setUserName(user.name || "");
        }
      } catch (error) {
        console.error("Failed to fetch user data on app load:", error);
      }
    };

    fetchUserData();
  }, [sessionId]);

  return (
    <>
      {/* Render Navbar once when logged in, but not on login/signup page */}
      {showNavbar ? <Navbar sessionId={sessionId} userName={userName} /> : null}

      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={<LandingPage />}
        />
        <Route
          path="/login"
          element={<LoginPage setSessionId={setSessionId} setUserName={setUserName} />}
        />

        {/* Protected routes */}
        <Route
          path="/experience"
          element={
            <ProtectedRoute sessionId={sessionId}>
              <ExperiencePage experience={experience} setExperience={setExperience} sessionId={sessionId} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/level"
          element={
            <ProtectedRoute sessionId={sessionId}>
              <LevelPage level={level} setLevel={setLevel} sessionId={sessionId} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/role"
          element={
            <ProtectedRoute sessionId={sessionId}>
              <RolePage role={role} setRole={setRole} sessionId={sessionId} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute sessionId={sessionId}>
              <Dashboard
                userName={userName}
                experience={experience}
                level={level}
                role={role}
                sessionId={sessionId}
                progress={progress}
                achievements={achievements}
                userLevel={userLevel}
                setExperience={setExperience}
                setLevel={setLevel}
                setRole={setRole}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute sessionId={sessionId}>
              <ProfilePage
                userName={userName}
                sessionId={sessionId}
                experience={experience}
                level={level}
                userLevel={userLevel}
                progress={progress}
                achievements={achievements}
                setExperience={setExperience}
                setLevel={setLevel}
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
              <ReportPage progress={progress} achievements={achievements} userLevel={userLevel} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agent"
          element={
            <ProtectedRoute sessionId={sessionId}>
              <AgentPage experience={experience} level={level} role={role} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
