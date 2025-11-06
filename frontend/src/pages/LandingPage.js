import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function LandingPage() {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  useEffect(() => {
    let rafId = null;
    let isHovering = false;

    const handleMouseMove = (e) => {
      if (!isHovering) return;
      
      // Cancel previous animation frame
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 8;
        const rotateY = (centerX - x) / 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });
    };

    const handleMouseEnter = () => {
      isHovering = true;
    };

    const handleMouseLeave = () => {
      isHovering = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      const card = cardRef.current;
      if (card) {
        card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
      }
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener("mouseenter", handleMouseEnter);
      card.addEventListener("mousemove", handleMouseMove, { passive: true });
      card.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (card) {
        card.removeEventListener("mouseenter", handleMouseEnter);
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Interviews",
      description: "Practice with advanced AI agents that simulate real interview scenarios",
    },
    {
      icon: "📊",
      title: "Real-time Feedback",
      description: "Get instant feedback on your answers, body language, and performance",
    },
    {
      icon: "🎯",
      title: "Personalized Questions",
      description: "Questions tailored to your experience level and difficulty preference",
    },
    {
      icon: "📈",
      title: "Progress Tracking",
      description: "Monitor your improvement with detailed analytics and progress reports",
    },
  ];

  return (
    <div className="landing-page">
      {/* Animated Background */}
      <div className="landing-background">
        <div className="floating-shapes">
          <motion.div
            className="shape shape-1"
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ willChange: "transform" }}
          />
          <motion.div
            className="shape shape-2"
            animate={{
              y: [0, 40, 0],
              x: [0, -30, 0],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ willChange: "transform" }}
          />
          <motion.div
            className="shape shape-3"
            animate={{
              y: [0, -50, 0],
              x: [0, 25, 0],
              rotate: [0, 90, 180],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ willChange: "transform" }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="landing-container">
        {/* Hero Section */}
        <motion.div
          className="landing-hero"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="hero-icon"
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ willChange: "transform" }}
          >
            🎯
          </motion.div>
          
          <motion.h1
            className="landing-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Interview AI
          </motion.h1>
          
          <motion.p
            className="landing-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Master Your Interview Skills with AI-Powered Practice
          </motion.p>
          
          <motion.p
            className="landing-description"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Prepare for your dream job with personalized interview practice sessions.
            Get real-time feedback, improve your answers, and build confidence.
          </motion.p>

          <motion.div
            className="landing-cta"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <button
              className="btn btn-primary btn-large"
              onClick={() => navigate("/login")}
            >
              <span>Get Started</span>
              <span className="btn-icon">→</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          className="landing-features"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 1.2 + index * 0.1, 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                whileHover={{ scale: 1.05, y: -10 }}
                style={{
                  transformStyle: "preserve-3d",
                  willChange: "transform",
                }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 3D Card Section */}
        <motion.div
          className="landing-3d-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <div
            ref={cardRef}
            className="landing-3d-card"
            style={{
              transformStyle: "preserve-3d",
              transition: "transform 0.1s ease-out",
            }}
          >
            <div className="3d-card-content">
              <h3 className="3d-card-title">Why Choose Interview AI?</h3>
              <ul className="3d-card-list">
                <li>✨ Practice anytime, anywhere with AI-powered interviews</li>
                <li>📊 Get detailed analytics on your performance</li>
                <li>🎯 Personalized questions based on your experience</li>
                <li>💪 Build confidence through repeated practice</li>
                <li>🚀 Track your progress and see improvement over time</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="landing-final-cta"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <h2 className="final-cta-title">Ready to Ace Your Next Interview?</h2>
          <p className="final-cta-text">Join thousands of professionals who are improving their interview skills</p>
          <button
            className="btn btn-primary btn-large"
            onClick={() => navigate("/login")}
          >
            <span>Start Practicing Now</span>
            <span className="btn-icon">🚀</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default LandingPage;

