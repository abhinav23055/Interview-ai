import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// 1. Accept the new setUserName prop
function LoginPage({ setSessionId, setUserName }) { 
  const [isLogin, setIsLogin] = useState(true); // Toggle between login & signup
  const [name, setName] = useState(""); // 2. Add state for the new name field
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin ? "/login" : "/register";
    
    // 3. Include the name in the body for signup requests
    const body = isLogin
      ? JSON.stringify({ email, password })
      : JSON.stringify({ name, email, password });

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
      });

      const data = await res.json();

      if (data.success) {
        if (isLogin) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.user._id);
          setSessionId(data.user._id);
          setUserName(data.user.name); // 4. Set the user's name in the app state after login

          alert("✅ Login successful!");
          navigate("/experience");
        } else {
          alert("✅ Signup successful! Please log in now.");
          setIsLogin(true); // switch to login tab
        }
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Server error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
      
      <div className="auth-card glass fade-in">
        {/* Tabs */}
        <div className="auth-tabs">
          <button 
            onClick={() => setIsLogin(true)} 
            className={`tab-button ${isLogin ? 'active' : ''}`}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)} 
            className={`tab-button ${!isLogin ? 'active' : ''}`}
          >
            Signup
          </button>
        </div>

        {/* Title */}
        <div className="auth-header">
          <div className="auth-icon">
            {isLogin ? "👋" : "✨"}
          </div>
          <h2 className="auth-title">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="auth-subtitle">
            {isLogin ? "Sign in to continue your journey" : "Join us and start practicing"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-input"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          
          <button type="submit" className="btn btn-primary auth-submit">
            <span>{isLogin ? "Sign In" : "Create Account"}</span>
            <span className="btn-icon">→</span>
          </button>
        </form>

        {/* Switch */}
        <div className="auth-switch">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              className="switch-link"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign up" : "Log in"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;