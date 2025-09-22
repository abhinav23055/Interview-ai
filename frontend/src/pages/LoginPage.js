import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({ setSessionId }) {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login & signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin ? "/login" : "/register";

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        if (isLogin) {
          // ✅ Store token + userId
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.user._id);
          setSessionId(data.user._id);

          alert("✅ Login successful!");
          navigate("/experience"); // go to next page
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
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(135deg, #74ebd5, #9face6)",
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
          width: "350px",
          textAlign: "center",
        }}
      >
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: "10px",
              border: "none",
              borderBottom: isLogin
                ? "3px solid #007bff"
                : "3px solid transparent",
              background: "transparent",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: "10px",
              border: "none",
              borderBottom: !isLogin
                ? "3px solid #007bff"
                : "3px solid transparent",
              background: "transparent",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Signup
          </button>
        </div>

        {/* Title */}
        <h2 style={{ marginBottom: "20px", color: "#333" }}>
          {isLogin ? "Welcome Back 👋" : "Create an Account ✨"}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
          <button
            type="submit"
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
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        {/* Switch */}
        <p style={{ marginTop: "15px", fontSize: "14px", color: "#555" }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            style={{ color: "#007bff", cursor: "pointer" }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up" : "Log in"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
