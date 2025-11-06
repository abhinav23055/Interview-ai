import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function AgentPage({ experience, level, role }) {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const recognitionRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const faceDetectorRef = useRef(null);
  const analysisIntervalRef = useRef(null);
  const finalTranscriptRef = useRef("");
  const [faceApiSupported, setFaceApiSupported] = useState(true);

  const [running, setRunning] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [logs, setLogs] = useState([]);
  const [questionQueue, setQuestionQueue] = useState([]);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionAnswers, setSessionAnswers] = useState([]);
  const [targetQuestionCount, setTargetQuestionCount] = useState(7);

  const [metrics, setMetrics] = useState({
    faceSeenMs: 0,
    sessionMs: 0,
    lookAwayEvents: 0,
    lastFaceSeenAt: null,
  });

  const questions = useMemo(() => {
    // Comprehensive question bank with role-based questions
    const bank = [
      // Software Engineer Questions
      { id: 1, level: "Easy", exp: "Fresher", role: "Software Engineer", text: "Tell me about yourself and your strengths as a software engineer." },
      { id: 2, level: "Easy", exp: "Intermediate", role: "Software Engineer", text: "Describe a challenging project you worked on and how you solved technical problems." },
      { id: 3, level: "Easy", exp: "Expert", role: "Software Engineer", text: "How do you mentor junior developers and ensure code quality in your team?" },
      { id: 4, level: "Medium", exp: "Fresher", role: "Software Engineer", text: "Explain the difference between var, let, and const in JavaScript." },
      { id: 5, level: "Medium", exp: "Intermediate", role: "Software Engineer", text: "How would you design a RESTful API for a todo app? What endpoints would you create?" },
      { id: 6, level: "Medium", exp: "Expert", role: "Software Engineer", text: "Discuss trade-offs of microservices vs monolith architecture. When would you choose each?" },
      { id: 7, level: "Hard", exp: "Fresher", role: "Software Engineer", text: "Walk through optimizing a slow web page. Where would you start and what tools would you use?" },
      { id: 8, level: "Hard", exp: "Intermediate", role: "Software Engineer", text: "How do you scale a service to handle 10x traffic spikes? What strategies would you implement?" },
      { id: 9, level: "Hard", exp: "Expert", role: "Software Engineer", text: "Design a highly available, low-latency architecture for a search autosuggest feature." },
      
      // Data Scientist Questions
      { id: 10, level: "Easy", exp: "Fresher", role: "Data Scientist", text: "Tell me about yourself and your interest in data science." },
      { id: 11, level: "Easy", exp: "Intermediate", role: "Data Scientist", text: "Describe a data science project you worked on. What was your approach?" },
      { id: 12, level: "Easy", exp: "Expert", role: "Data Scientist", text: "How do you ensure data quality and handle missing values in large datasets?" },
      { id: 13, level: "Medium", exp: "Fresher", role: "Data Scientist", text: "Explain the difference between supervised and unsupervised learning with examples." },
      { id: 14, level: "Medium", exp: "Intermediate", role: "Data Scientist", text: "How would you build a recommendation system? What algorithms would you consider?" },
      { id: 15, level: "Medium", exp: "Expert", role: "Data Scientist", text: "Discuss overfitting in machine learning. How do you prevent and detect it?" },
      { id: 16, level: "Hard", exp: "Fresher", role: "Data Scientist", text: "Walk through the steps of a typical machine learning pipeline." },
      { id: 17, level: "Hard", exp: "Intermediate", role: "Data Scientist", text: "How would you handle class imbalance in a classification problem?" },
      { id: 18, level: "Hard", exp: "Expert", role: "Data Scientist", text: "Design an A/B testing framework for evaluating a new recommendation algorithm." },
      
      // DevOps Engineer Questions
      { id: 19, level: "Easy", exp: "Fresher", role: "DevOps Engineer", text: "Tell me about yourself and your interest in DevOps." },
      { id: 20, level: "Easy", exp: "Intermediate", role: "DevOps Engineer", text: "Describe a CI/CD pipeline you've set up. What tools did you use?" },
      { id: 21, level: "Easy", exp: "Expert", role: "DevOps Engineer", text: "How do you ensure high availability and disaster recovery in your infrastructure?" },
      { id: 22, level: "Medium", exp: "Fresher", role: "DevOps Engineer", text: "Explain the difference between containers and virtual machines." },
      { id: 23, level: "Medium", exp: "Intermediate", role: "DevOps Engineer", text: "How would you set up monitoring and alerting for a production system?" },
      { id: 24, level: "Medium", exp: "Expert", role: "DevOps Engineer", text: "Discuss infrastructure as code. What are the benefits and which tools do you prefer?" },
      { id: 25, level: "Hard", exp: "Fresher", role: "DevOps Engineer", text: "Walk through deploying a microservices application to the cloud." },
      { id: 26, level: "Hard", exp: "Intermediate", role: "DevOps Engineer", text: "How would you handle a production incident? What's your process?" },
      { id: 27, level: "Hard", exp: "Expert", role: "DevOps Engineer", text: "Design a scalable, multi-region infrastructure for a global application." },
      
      // Product Manager Questions
      { id: 28, level: "Easy", exp: "Fresher", role: "Product Manager", text: "Tell me about yourself and why you're interested in product management." },
      { id: 29, level: "Easy", exp: "Intermediate", role: "Product Manager", text: "Describe a product you managed. How did you prioritize features?" },
      { id: 30, level: "Easy", exp: "Expert", role: "Product Manager", text: "How do you balance user needs, business goals, and technical constraints?" },
      { id: 31, level: "Medium", exp: "Fresher", role: "Product Manager", text: "Explain the product development lifecycle from ideation to launch." },
      { id: 32, level: "Medium", exp: "Intermediate", role: "Product Manager", text: "How would you measure the success of a new feature? What metrics would you track?" },
      { id: 33, level: "Medium", exp: "Expert", role: "Product Manager", text: "Discuss how you handle conflicting stakeholder requirements." },
      { id: 34, level: "Hard", exp: "Fresher", role: "Product Manager", text: "Walk through how you would conduct user research for a new product." },
      { id: 35, level: "Hard", exp: "Intermediate", role: "Product Manager", text: "How would you pivot a product that's not meeting its goals?" },
      { id: 36, level: "Hard", exp: "Expert", role: "Product Manager", text: "Design a go-to-market strategy for a new SaaS product." },
      
      // QA Engineer Questions
      { id: 37, level: "Easy", exp: "Fresher", role: "QA Engineer", text: "Tell me about yourself and your interest in quality assurance." },
      { id: 38, level: "Easy", exp: "Intermediate", role: "QA Engineer", text: "Describe your testing process for a new feature. What types of testing do you perform?" },
      { id: 39, level: "Easy", exp: "Expert", role: "QA Engineer", text: "How do you ensure test coverage and maintain test suites in an agile environment?" },
      { id: 40, level: "Medium", exp: "Fresher", role: "QA Engineer", text: "Explain the difference between unit testing, integration testing, and end-to-end testing." },
      { id: 41, level: "Medium", exp: "Intermediate", role: "QA Engineer", text: "How would you test a payment processing system? What scenarios would you cover?" },
      { id: 42, level: "Medium", exp: "Expert", role: "QA Engineer", text: "Discuss test automation strategy. When do you automate vs. manual testing?" },
      { id: 43, level: "Hard", exp: "Fresher", role: "QA Engineer", text: "Walk through how you would test a mobile application across different devices." },
      { id: 44, level: "Hard", exp: "Intermediate", role: "QA Engineer", text: "How would you handle testing in a continuous deployment environment?" },
      { id: 45, level: "Hard", exp: "Expert", role: "QA Engineer", text: "Design a comprehensive testing strategy for a microservices architecture." },
      
      // UI/UX Designer Questions
      { id: 46, level: "Easy", exp: "Fresher", role: "UI/UX Designer", text: "Tell me about yourself and your design philosophy." },
      { id: 47, level: "Easy", exp: "Intermediate", role: "UI/UX Designer", text: "Describe a design project you worked on. What was your design process?" },
      { id: 48, level: "Easy", exp: "Expert", role: "UI/UX Designer", text: "How do you ensure accessibility in your designs?" },
      { id: 49, level: "Medium", exp: "Fresher", role: "UI/UX Designer", text: "Explain the difference between UI and UX design." },
      { id: 50, level: "Medium", exp: "Intermediate", role: "UI/UX Designer", text: "How would you redesign a complex form to improve user experience?" },
      { id: 51, level: "Medium", exp: "Expert", role: "UI/UX Designer", text: "Discuss how you balance user needs with business requirements in design decisions." },
      { id: 52, level: "Hard", exp: "Fresher", role: "UI/UX Designer", text: "Walk through your user research process for a new product." },
      { id: 53, level: "Hard", exp: "Intermediate", role: "UI/UX Designer", text: "How would you design a mobile-first experience for a web application?" },
      { id: 54, level: "Hard", exp: "Expert", role: "UI/UX Designer", text: "Design a user onboarding flow for a complex SaaS application." },
      
      // Mobile Developer Questions
      { id: 55, level: "Easy", exp: "Fresher", role: "Mobile Developer", text: "Tell me about yourself and your experience with mobile development." },
      { id: 56, level: "Easy", exp: "Intermediate", role: "Mobile Developer", text: "Describe a mobile app you developed. What challenges did you face?" },
      { id: 57, level: "Easy", exp: "Expert", role: "Mobile Developer", text: "How do you optimize mobile app performance and battery usage?" },
      { id: 58, level: "Medium", exp: "Fresher", role: "Mobile Developer", text: "Explain the difference between native, hybrid, and cross-platform mobile development." },
      { id: 59, level: "Medium", exp: "Intermediate", role: "Mobile Developer", text: "How would you handle offline functionality in a mobile app?" },
      { id: 60, level: "Medium", exp: "Expert", role: "Mobile Developer", text: "Discuss mobile app architecture patterns. Which do you prefer and why?" },
      { id: 61, level: "Hard", exp: "Fresher", role: "Mobile Developer", text: "Walk through implementing push notifications in a mobile app." },
      { id: 62, level: "Hard", exp: "Intermediate", role: "Mobile Developer", text: "How would you handle app updates and backward compatibility?" },
      { id: 63, level: "Hard", exp: "Expert", role: "Mobile Developer", text: "Design a scalable mobile app architecture that supports millions of users." },
      
      // System Architect Questions
      { id: 64, level: "Easy", exp: "Fresher", role: "System Architect", text: "Tell me about yourself and your interest in system architecture." },
      { id: 65, level: "Easy", exp: "Intermediate", role: "System Architect", text: "Describe a system architecture you designed. What were the key decisions?" },
      { id: 66, level: "Easy", exp: "Expert", role: "System Architect", text: "How do you ensure scalability and reliability in system design?" },
      { id: 67, level: "Medium", exp: "Fresher", role: "System Architect", text: "Explain the difference between horizontal and vertical scaling." },
      { id: 68, level: "Medium", exp: "Intermediate", role: "System Architect", text: "How would you design a distributed caching system?" },
      { id: 69, level: "Medium", exp: "Expert", role: "System Architect", text: "Discuss CAP theorem and its implications for distributed systems." },
      { id: 70, level: "Hard", exp: "Fresher", role: "System Architect", text: "Walk through designing a real-time messaging system." },
      { id: 71, level: "Hard", exp: "Intermediate", role: "System Architect", text: "How would you design a system to handle 1 million concurrent users?" },
      { id: 72, level: "Hard", exp: "Expert", role: "System Architect", text: "Design a globally distributed system with strong consistency requirements." },
      
      // Additional Software Engineer Questions
      { id: 73, level: "Easy", exp: "Fresher", role: "Software Engineer", text: "What programming languages are you most comfortable with and why?" },
      { id: 74, level: "Easy", exp: "Intermediate", role: "Software Engineer", text: "How do you approach debugging a complex bug in production?" },
      { id: 75, level: "Easy", exp: "Expert", role: "Software Engineer", text: "How do you handle technical debt in a fast-moving startup environment?" },
      { id: 76, level: "Medium", exp: "Fresher", role: "Software Engineer", text: "Explain the concept of closures in JavaScript with an example." },
      { id: 77, level: "Medium", exp: "Intermediate", role: "Software Engineer", text: "How would you implement authentication and authorization in a web application?" },
      { id: 78, level: "Medium", exp: "Expert", role: "Software Engineer", text: "Discuss database sharding strategies and when to use them." },
      { id: 79, level: "Hard", exp: "Fresher", role: "Software Engineer", text: "How would you implement a rate limiter to prevent API abuse?" },
      { id: 80, level: "Hard", exp: "Intermediate", role: "Software Engineer", text: "Design a system to handle real-time collaborative editing like Google Docs." },
      { id: 81, level: "Hard", exp: "Expert", role: "Software Engineer", text: "How would you implement a distributed transaction system across microservices?" },
      
      // Additional Data Scientist Questions
      { id: 82, level: "Easy", exp: "Fresher", role: "Data Scientist", text: "What tools and libraries do you use for data analysis?" },
      { id: 83, level: "Easy", exp: "Intermediate", role: "Data Scientist", text: "How do you validate the accuracy of a machine learning model?" },
      { id: 84, level: "Easy", exp: "Expert", role: "Data Scientist", text: "How do you handle feature engineering for high-dimensional datasets?" },
      { id: 85, level: "Medium", exp: "Fresher", role: "Data Scientist", text: "Explain cross-validation and why it's important in machine learning." },
      { id: 86, level: "Medium", exp: "Intermediate", role: "Data Scientist", text: "How would you build a fraud detection system using machine learning?" },
      { id: 87, level: "Medium", exp: "Expert", role: "Data Scientist", text: "Discuss model interpretability and explainability. Why is it important?" },
      { id: 88, level: "Hard", exp: "Fresher", role: "Data Scientist", text: "Walk through the process of deploying a machine learning model to production." },
      { id: 89, level: "Hard", exp: "Intermediate", role: "Data Scientist", text: "How would you handle concept drift in a production ML system?" },
      { id: 90, level: "Hard", exp: "Expert", role: "Data Scientist", text: "Design an ML pipeline that handles streaming data and real-time predictions." },
      
      // Additional DevOps Questions
      { id: 91, level: "Easy", exp: "Fresher", role: "DevOps Engineer", text: "What is version control and why is it important?" },
      { id: 92, level: "Easy", exp: "Intermediate", role: "DevOps Engineer", text: "How do you ensure security in your CI/CD pipeline?" },
      { id: 93, level: "Easy", exp: "Expert", role: "DevOps Engineer", text: "How do you manage secrets and sensitive data in cloud environments?" },
      { id: 94, level: "Medium", exp: "Fresher", role: "DevOps Engineer", text: "Explain the difference between blue-green and canary deployments." },
      { id: 95, level: "Medium", exp: "Intermediate", role: "DevOps Engineer", text: "How would you set up auto-scaling for a web application?" },
      { id: 96, level: "Medium", exp: "Expert", role: "DevOps Engineer", text: "Discuss Kubernetes architecture and how you would design a cluster." },
      { id: 97, level: "Hard", exp: "Fresher", role: "DevOps Engineer", text: "Walk through setting up a complete CI/CD pipeline from scratch." },
      { id: 98, level: "Hard", exp: "Intermediate", role: "DevOps Engineer", text: "How would you implement disaster recovery for a multi-region application?" },
      { id: 99, level: "Hard", exp: "Expert", role: "DevOps Engineer", text: "Design a zero-downtime deployment strategy for a critical production system." },
      
      // Additional Product Manager Questions
      { id: 100, level: "Easy", exp: "Fresher", role: "Product Manager", text: "What makes a good product manager in your opinion?" },
      { id: 101, level: "Easy", exp: "Intermediate", role: "Product Manager", text: "How do you gather and prioritize user feedback?" },
      { id: 102, level: "Easy", exp: "Expert", role: "Product Manager", text: "How do you align product strategy with company goals?" },
      { id: 103, level: "Medium", exp: "Fresher", role: "Product Manager", text: "Explain the difference between a feature and a product." },
      { id: 104, level: "Medium", exp: "Intermediate", role: "Product Manager", text: "How would you launch a new product feature to maximize adoption?" },
      { id: 105, level: "Medium", exp: "Expert", role: "Product Manager", text: "Discuss how you would handle a product that's not meeting KPIs." },
      { id: 106, level: "Hard", exp: "Fresher", role: "Product Manager", text: "Walk through creating a product roadmap for the next 6 months." },
      { id: 107, level: "Hard", exp: "Intermediate", role: "Product Manager", text: "How would you build a product from zero to one in a new market?" },
      { id: 108, level: "Hard", exp: "Expert", role: "Product Manager", text: "Design a product strategy for entering a competitive market." },
    ];
    
    // Filter questions based on level, experience, and role
    let filtered = bank.filter(q => {
      const levelMatch = !level || q.level === level;
      const expMatch = !experience || q.exp === experience;
      const roleMatch = !role || q.role === role;
      return levelMatch && expMatch && roleMatch;
    });
    
    // If no questions match, return all questions (fallback)
    return filtered.length > 0 ? filtered : bank;
  }, [experience, level, role]);

  const storageKey = useMemo(() => `agentAskedIds:${experience || 'any'}:${level || 'any'}:${role || 'any'}`, [experience, level, role]);

  const loadAskedIds = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  };

  const saveAskedId = (id) => {
    try {
      const prev = loadAskedIds();
      if (!prev.includes(id)) {
        const next = [...prev, id];
        localStorage.setItem(storageKey, JSON.stringify(next));
      }
    } catch (_) { /* ignore */ }
  };

  const resetAskedIdsIfAllUsed = () => {
    const asked = loadAskedIds();
    const available = questions.map(q => q.id);
    const remaining = available.filter(id => !asked.includes(id));
    if (remaining.length === 0) {
      try { localStorage.removeItem(storageKey); } catch (_) { /* ignore */ }
    }
  };

  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const startMedia = async () => {
    if (mediaStreamRef.current) return;
    const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false });
    mediaStreamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }
  };

  const stopMedia = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
  };

  const initFaceDetector = () => {
    try {
      // Use Shape/Face Detection API if available; otherwise no-op.
      // eslint-disable-next-line no-undef
      const FD = window.FaceDetector;
      if (FD) {
        faceDetectorRef.current = new FD({ fastMode: true });
        setFaceApiSupported(true);
      } else {
        faceDetectorRef.current = null;
        setFaceApiSupported(false);
      }
    } catch (e) {
      faceDetectorRef.current = null;
      setFaceApiSupported(false);
    }
  };

  const analyzeFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    if (video.readyState < 2) return; // ensure metadata is loaded

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    let faceDetected = false;
    if (faceDetectorRef.current && typeof faceDetectorRef.current.detect === "function") {
      try {
        const faces = await faceDetectorRef.current.detect(canvas);
        if (faces && faces.length > 0) {
          faceDetected = true;
          // Draw a subtle rectangle around first face
          const box = faces[0].boundingBox || faces[0].boundingClientRect;
          if (box) {
            ctx.strokeStyle = "rgba(59,130,246,0.8)";
            ctx.lineWidth = 2;
            ctx.strokeRect(box.x, box.y, box.width, box.height);
          }
        }
      } catch (e) {
        // ignore detection errors
      }
    } else {
      // Fallback heuristic when FaceDetector is not supported
      try {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const patchW = Math.max(16, Math.floor(canvas.width * 0.05));
          const patchH = Math.max(16, Math.floor(canvas.height * 0.05));
          const sx = Math.max(0, Math.floor(canvas.width / 2 - patchW / 2));
          const sy = Math.max(0, Math.floor(canvas.height / 2 - patchH / 2));
          const data = ctx.getImageData(sx, sy, patchW, patchH).data;
          let sum = 0;
          for (let i = 0; i < data.length; i += 4) {
            sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          }
          const avg = sum / (data.length / 4);
          faceDetected = avg > 20;
        }
      } catch (e) {
        faceDetected = false;
      }
    }

    setMetrics(prev => {
      const now = Date.now();
      const startedAt = prev.lastFaceSeenAt;
      let faceSeenMs = prev.faceSeenMs;
      let lookAwayEvents = prev.lookAwayEvents;

      if (faceDetected) {
        faceSeenMs = faceSeenMs + 200; // approx by interval
      } else {
        // Count a look-away event if we previously saw face within last second
        if (startedAt && now - startedAt < 1000) {
          lookAwayEvents += 1;
        }
      }

      return {
        faceSeenMs,
        sessionMs: prev.sessionMs + 200,
        lookAwayEvents,
        lastFaceSeenAt: faceDetected ? now : prev.lastFaceSeenAt,
      };
    });
  };

  const startAnalysis = () => {
    if (analysisIntervalRef.current) return;
    analysisIntervalRef.current = setInterval(analyzeFrame, 200);
  };

  const stopAnalysis = () => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
  };

  const startInterview = async () => {
    await startMedia();
    initFaceDetector();
    setMetrics({ faceSeenMs: 0, sessionMs: 0, lookAwayEvents: 0, lastFaceSeenAt: null });
    setRunning(true);
    setAnswerText("");
    setQuestionsAnswered(0);
    setInterviewComplete(false);
    setSessionAnswers([]);
    setTargetQuestionCount(Math.floor(Math.random() * 6) + 5); // Random between 5-10
    // Build a non-repeating, shuffled queue
    resetAskedIdsIfAllUsed();
    const asked = loadAskedIds();
    const remaining = questions.filter(q => !asked.includes(q.id));
    const queue = shuffle(remaining.length ? remaining : questions);
    setQuestionQueue(queue);
    setCurrentQuestion(queue[0] || null);
    const video = videoRef.current;
    if (video) {
      if (video.readyState >= 2) {
        startAnalysis();
      } else {
        const onPlaying = () => {
          startAnalysis();
          video.removeEventListener("playing", onPlaying);
        };
        video.addEventListener("playing", onPlaying);
      }
    } else {
      startAnalysis();
    }
  };

  const stopInterview = () => {
    stopAnalysis();
    stopTranscription();
    stopMedia();
    setRunning(false);
  };

  const startTranscription = () => {
    if (transcribing) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setLogs(prev => ["Speech Recognition not supported in this browser.", ...prev]);
      return;
    }
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    // Initialize accumulator with any existing text so we don't lose it
    finalTranscriptRef.current = (answerText || "");

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          finalTranscriptRef.current += (res[0]?.transcript || "") + " ";
        } else {
          interim += res[0]?.transcript || "";
        }
      }
      setAnswerText((finalTranscriptRef.current + interim).trim());
    };
    recognition.onend = () => {
      setTranscribing(false);
      setAnswerText(finalTranscriptRef.current.trim());
    };
    recognition.onerror = () => {
      setTranscribing(false);
    };
    recognition.start();
    recognitionRef.current = recognition;
    setTranscribing(true);
  };

  const stopTranscription = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
      recognitionRef.current = null;
    }
    // Ensure final accumulated transcript is reflected
    setAnswerText(finalTranscriptRef.current.trim());
    setTranscribing(false);
  };

  const nextQuestion = () => {
    if (!currentQuestion && (!questionQueue || questionQueue.length === 0)) return;
    
    // Save current answer
    const wordCount = (answerText || "").trim().split(/\s+/).filter(Boolean).length;
    if (currentQuestion && answerText.trim()) {
      setSessionAnswers(prev => [...prev, {
        question: currentQuestion.text,
        answer: answerText.trim(),
        wordCount,
        questionId: currentQuestion.id
      }]);
    }
    
    // Save current as asked
    if (currentQuestion?.id) saveAskedId(currentQuestion.id);
    
    // Increment answered count
    const newCount = questionsAnswered + 1;
    setQuestionsAnswered(newCount);
    
    // Check if interview should complete (5-10 questions)
    if (newCount >= targetQuestionCount) {
      setInterviewComplete(true);
      stopAnalysis();
      stopTranscription();
      setLogs(prev => [`Interview complete! You answered ${newCount} questions. Click "View Feedback" to see your results.`, ...prev]);
      setCurrentQuestion(null);
      
      // Dispatch event for ProfilePage to capture
      const sessionData = {
        questionsAnswered: newCount,
        totalWords: sessionAnswers.reduce((sum, a) => sum + a.wordCount, 0),
        avgEyeContact: Math.round((metrics.faceSeenMs / Math.max(metrics.sessionMs, 1)) * 100),
        avgCorrectness: computeFeedback().correctnessScore,
        answers: sessionAnswers,
      };
      window.dispatchEvent(new CustomEvent("interviewComplete", { detail: sessionData }));
      
      return;
    }
    
    // Advance in queue
    const idx = questionQueue.findIndex(q => q.id === currentQuestion?.id);
    const nextIdx = idx >= 0 ? idx + 1 : 1;
    const nxt = questionQueue[nextIdx] || null;
    setLogs(prev => [
      `Answer saved (${wordCount} words). Question ${newCount}/${targetQuestionCount}`,
      ...prev,
    ]);
    // Clear previous answer and reset transcript accumulator
    setAnswerText("");
    finalTranscriptRef.current = "";
    setCurrentQuestion(nxt);
    if (!nxt) {
      setInterviewComplete(true);
      setLogs(prev => ["No more questions in this session. Great job!", ...prev]);
    }
  };

  const computeFeedback = () => {
    const ms = Math.max(metrics.sessionMs, 1);
    const eyeContactPct = Math.round((metrics.faceSeenMs / ms) * 100);
    const words = (answerText || "").trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const fillerWords = ["um", "uh", "like", "you know", "so", "actually"]; 
    const fillerCount = words.filter(w => fillerWords.includes(w.toLowerCase())).length;

    // Simple keyword check based on question
    const keywordsById = {
      4: ["var", "let", "const"],
      5: ["resource", "endpoint", "status", "auth"],
      6: ["latency", "coupling", "observability"],
      8: ["cache", "autoscale", "queue"],
      9: ["replica", "index", "shard", "cache"],
    };
    const expected = keywordsById[currentQuestion?.id] || [];
    const lowerAns = (answerText || "").toLowerCase();
    const present = expected.filter(k => lowerAns.includes(k));
    const missing = expected.filter(k => !lowerAns.includes(k));
    const correctnessScore = expected.length ? Math.round((present.length / expected.length) * 100) : (wordCount > 0 ? 70 : 0);

    return {
      eyeContactPct,
      lookAwayEvents: metrics.lookAwayEvents,
      lengthAdvice: wordCount < 30 ? "Add more detail and examples." : wordCount > 180 ? "Be concise and focused." : "Good depth.",
      fillerAdvice: fillerCount > 3 ? "Reduce filler words for clarity." : "Filler words are under control.",
      contentAdvice: expected.length ? `${present.length}/${expected.length} key points covered.` : "Good structure; add specifics where possible.",
      correctnessScore,
      missing,
    };
  };

  useEffect(() => {
    return () => {
      stopInterview();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="agent-container">
      <div className="agent-card glass fade-in">
        <div className="agent-header">
          <h2 className="agent-title">Interview Agent</h2>
          <p className="agent-subtitle">Personalized questions for {role || "your role"} - {experience || "your"} level ({level || "All levels"})</p>
        </div>

        <div className="agent-grid">
          <div className="agent-left">
            <div className="video-wrap">
              <video ref={videoRef} className="agent-video" muted playsInline />
              <canvas ref={canvasRef} className="agent-canvas" />
            </div>

            <div className="agent-controls">
              {!running ? (
                <button className="btn btn-primary" onClick={startInterview}>Start Interview</button>
              ) : (
                <button className="btn btn-secondary" onClick={stopInterview}>Stop</button>
              )}
              {!transcribing ? (
                <button className="btn btn-primary" onClick={startTranscription} disabled={!running}>Start Answer</button>
              ) : (
                <button className="btn btn-secondary" onClick={stopTranscription}>Stop Answer</button>
              )}
              <button className="btn btn-ghost" onClick={() => navigate("/dashboard")}>Back</button>
            </div>

            <div className="question-box">
              <div className="question-label">Current Question {questionsAnswered > 0 && `(${questionsAnswered} answered)`}</div>
              <div className="question-text">{currentQuestion ? currentQuestion.text : interviewComplete ? "Interview Complete! 🎉" : "Click Start to begin."}</div>
              <div className="question-actions">
                {!interviewComplete ? (
                  <button className="btn btn-primary" onClick={nextQuestion} disabled={!running || !currentQuestion}>Next Question</button>
                ) : (
                  <button className="btn btn-primary" onClick={() => setShowFeedback(true)}>View Feedback</button>
                )}
              </div>
            </div>

            <div className="answer-box">
              <div className="answer-label">Your Answer (auto transcript)</div>
              <textarea
                className="answer-textarea"
                placeholder="Speak or type your answer here..."
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
              />
            </div>
          </div>

          <div className="agent-right">
            <div className="feedback-card">
              <div className="feedback-title">Live Feedback</div>
              {(() => {
                const f = computeFeedback();
                return (
                  <div className="feedback-content">
                    <div className="feedback-row"><span>Status</span><strong>{running ? (faceApiSupported ? "Analyzing" : "Analyzing (fallback)") : "Idle"}</strong></div>
                    <div className="feedback-row"><span>Eye contact</span><strong>{f.eyeContactPct}%</strong></div>
                    <div className="feedback-row"><span>Look-away events</span><strong>{f.lookAwayEvents}</strong></div>
                    <div className="feedback-row"><span>Answer length</span><strong>{f.lengthAdvice}</strong></div>
                    <div className="feedback-row"><span>Filler words</span><strong>{f.fillerAdvice}</strong></div>
                    <div className="feedback-row"><span>Content coverage</span><strong>{f.contentAdvice}</strong></div>
                    <div className="feedback-row"><span>Correctness</span><strong>{f.correctnessScore}%</strong></div>
                    {f.missing && f.missing.length > 0 ? (
                      <div className="feedback-row"><span>Missing keywords</span><strong>{f.missing.join(", ")}</strong></div>
                    ) : null}
                  </div>
                );
              })()}
            </div>

            <div className="log-card">
              <div className="log-title">Session Log</div>
              <div className="log-list">
                {logs.map((l, i) => (
                  <div className="log-item" key={i}>{l}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="feedback-modal-overlay" onClick={() => setShowFeedback(false)}>
          <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
            <div className="feedback-modal-header">
              <h2>Interview Feedback Summary</h2>
              <button className="close-btn" onClick={() => setShowFeedback(false)}>×</button>
            </div>
            <div className="feedback-modal-content">
              <div className="summary-stats">
                <div className="stat-item">
                  <span className="stat-label">Questions Answered</span>
                  <span className="stat-value">{questionsAnswered}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Average Eye Contact</span>
                  <span className="stat-value">{Math.round((metrics.faceSeenMs / Math.max(metrics.sessionMs, 1)) * 100)}%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Look-aways</span>
                  <span className="stat-value">{metrics.lookAwayEvents}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Words</span>
                  <span className="stat-value">{sessionAnswers.reduce((sum, a) => sum + a.wordCount, 0)}</span>
                </div>
              </div>
              
              <div className="answers-summary">
                <h3>Your Answers</h3>
                {sessionAnswers.map((item, idx) => (
                  <div key={idx} className="answer-item">
                    <div className="answer-question"><strong>Q{idx + 1}:</strong> {item.question}</div>
                    <div className="answer-text">{item.answer.substring(0, 200)}{item.answer.length > 200 ? '...' : ''}</div>
                    <div className="answer-meta">{item.wordCount} words</div>
                  </div>
                ))}
              </div>
              
              <div className="feedback-actions">
                <button className="btn btn-primary" onClick={() => {
                  setShowFeedback(false);
                  navigate("/dashboard");
                }}>Back to Dashboard</button>
                <button className="btn btn-secondary" onClick={() => {
                  setShowFeedback(false);
                  setInterviewComplete(false);
                  setQuestionsAnswered(0);
                  setSessionAnswers([]);
                  startInterview();
                }}>Start New Interview</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgentPage;


