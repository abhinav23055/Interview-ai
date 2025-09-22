import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// Define the total number of rounds for the interview
const TOTAL_ROUNDS = 3;

function RoundsPage({ sessionId, experience, level, setProgress, setUserLevel, userLevel, setAchievements, achievements }) {
  const navigate = useNavigate();

  // State for the multi-round interview flow
  const [currentRound, setCurrentRound] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isRoundOver, setIsRoundOver] = useState(false);
  const [sessionAchievements, setSessionAchievements] = useState([]);

  // This function fetches a new question from the backend
  const fetchQuestion = async () => {
    try {
      setIsLoading(true);
      setFeedback("");
      setUserAnswer("");
      setIsRoundOver(false);

      const res = await fetch(`http://localhost:5000/api/get-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experience, level }),
      });
      const data = await res.json();
      if (data.success) {
        setQuestion(data.question);
      }
    } catch (error) {
      console.error("Error fetching question:", error);
      setQuestion("Sorry, we couldn't load a question. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch the first question when the page loads
  useEffect(() => {
    fetchQuestion();
  }, [experience, level]);

  // Handle submitting the user's answer
  const handleSubmitAnswer = async () => {
    if (!userAnswer) {
      alert("Please provide an answer before submitting.");
      return;
    }
    
    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:5000/api/evaluate-answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer: userAnswer }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback(data.feedback);
        setIsRoundOver(true); // Mark the round as over to show feedback
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      setFeedback("Sorry, there was an error evaluating your answer.");
    } finally {
      setIsLoading(false);
    }
  };

  // Logic for what happens after a round is complete
  const handleNextStep = () => {
    let newAchievements = [...sessionAchievements];

    // Grant an achievement for the first round
    if (currentRound === 1 && !newAchievements.includes("First Round Complete")) {
      newAchievements.push("First Round Complete");
    }

    setSessionAchievements(newAchievements);

    // Check if there are more rounds to go
    if (currentRound < TOTAL_ROUNDS) {
      setCurrentRound(prev => prev + 1);
      setProgress(Math.round((currentRound / TOTAL_ROUNDS) * 100)); // Update progress bar
      fetchQuestion(); // Fetch the next question
    } else {
      // This was the final round, so we finish the interview
      finishInterview(newAchievements);
    }
  };

  // Final function to save everything and navigate away
  const finishInterview = async (finalSessionAchievements) => {
    setIsLoading(true);

    // Add final achievement
    const finalAchievementsList = [...achievements, ...finalSessionAchievements, "Full Interview Complete"];
    
    // Update final state in App.js
    setProgress(100);
    setUserLevel(userLevel + 1);
    setAchievements(finalAchievementsList);
    
    // Save all final data to the backend
    try {
      await fetch(`http://localhost:5000/profile/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          progress: 100,
          userLevel: userLevel + 1,
          achievements: finalAchievementsList,
        }),
      });
    } catch (error) {
      console.error("Failed to save final progress:", error);
    } finally {
      navigate('/report'); // Navigate to the report page
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f4f7f9", minHeight: "100vh" }}>
      <Navbar sessionId={sessionId} />
      <div style={{ maxWidth: "800px", margin: "40px auto", padding: "40px", background: "white", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", textAlign: "center" }}>
        
        <h1 style={{ color: "#333", marginBottom: "10px" }}>Interview Session</h1>
        <p style={{ color: "#777", marginBottom: "30px", fontSize: "1.2rem" }}>Round {currentRound} of {TOTAL_ROUNDS}</p>

        {isLoading && <p>Loading...</p>}

        {!isLoading && (
          <>
            {/* Question Display */}
            <div style={{ marginBottom: "30px", padding: "20px", background: "#f9f9f9", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
              <h3 style={{ color: "#555", marginBottom: "10px" }}>Question:</h3>
              <p style={{ fontSize: "1.2rem", color: "#333", lineHeight: "1.6" }}>{question}</p>
            </div>

            {/* Answer and Feedback Section */}
            {!isRoundOver ? (
              <>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  rows={10}
                  style={{ width: "100%", padding: "15px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }}
                />
                <button onClick={handleSubmitAnswer} style={{ padding: "12px 24px", fontSize: "16px", marginTop: "20px", cursor: "pointer", background: "#007bff", color: "white", border: "none", borderRadius: "8px" }}>
                  Submit Answer
                </button>
              </>
            ) : (
              <div style={{ marginTop: "20px", padding: "20px", background: "#e8f5e9", color: "#2e7d32", borderRadius: "8px" }}>
                <h3 style={{ marginBottom: "10px" }}>Feedback:</h3>
                <p style={{ fontSize: "1rem", lineHeight: "1.6" }}>{feedback}</p>
                <button onClick={handleNextStep} style={{ padding: "12px 24px", fontSize: "16px", marginTop: "20px", cursor: "pointer", background: "#28a745", color: "white", border: "none", borderRadius: "8px" }}>
                  {currentRound < TOTAL_ROUNDS ? "Next Question" : "Finish & View Report"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default RoundsPage;