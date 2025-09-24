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
    <div className="rounds-container">
      <Navbar sessionId={sessionId} />
      <div className="container">
        <div className="rounds-card glass fade-in">
          <h1 className="rounds-title">Interview Session</h1>
          <p className="rounds-subtitle">Round {currentRound} of {TOTAL_ROUNDS}</p>

          {isLoading && <p className="loading-text">Loading...</p>}

          {!isLoading && (
            <>
              {/* Question Display */}
              <div className="question-card">
                <h3 className="question-label">Question:</h3>
                <p className="question-text">{question}</p>
              </div>

              {/* Answer and Feedback Section */}
              {!isRoundOver ? (
                <>
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    rows={10}
                    className="answer-textarea"
                  />
                  <button onClick={handleSubmitAnswer} className="btn btn-primary">
                    Submit Answer
                  </button>
                </>
              ) : (
                <div className="feedback-card">
                  <h3 className="feedback-title">Feedback:</h3>
                  <p className="feedback-text">{feedback}</p>
                  <button onClick={handleNextStep} className="btn btn-secondary">
                    {currentRound < TOTAL_ROUNDS ? "Next Question" : "Finish & View Report"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoundsPage;