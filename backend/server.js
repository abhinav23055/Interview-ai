const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Load env variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 👤 User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  // profile fields
  experience: { type: String, default: "" },
  level: { type: String, default: "" },
  progress: { type: Number, default: 0 },
  achievements: { type: [String], default: [] },
  userLevel: { type: Number, default: 1 },
});

const User = mongoose.model("User", userSchema);

// 📝 Register route
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Register error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

// 🔑 Login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        experience: user.experience,
        level: user.level,
        progress: user.progress,
        achievements: user.achievements,
        userLevel: user.userLevel,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

// 📖 Get profile
app.get("/profile/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    console.error("❌ Profile fetch error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

// ✏️ Update profile
app.put("/profile/:userId", async (req, res) => {
  try {
    const { experience, level, progress, achievements, userLevel } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { experience, level, progress, achievements, userLevel },
      { new: true }
    ).select("-password");

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("❌ Profile update error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});


// ==========================================================
// ✅ NEW AI INTERVIEW ENDPOINTS
// ==========================================================

// 🤖 Get a new question
app.post('/api/get-question', async (req, res) => {
    const { experience, level } = req.body;
    // In a real app, you would look up a question in your database
    // based on the user's experience and level.
    console.log(`Fetching question for: ${experience}, ${level}`);
    
    // For now, we'll just send a placeholder question.
    const question = "Tell me about a challenging project you worked on and how you handled it.";
    res.json({ success: true, question: question });
});

// 🤖 Evaluate an answer
app.post('/api/evaluate-answer', async (req, res) => {
    const { answer } = req.body;
    // In a real app, you would send this answer to an AI service for evaluation.
    console.log(`Evaluating answer: ${answer.substring(0, 50)}...`);

    // For now, we'll just send back placeholder feedback.
    const feedback = "This is a good start. To make it stronger, you could provide more specific details about the project's outcome and what you learned from the experience.";
    res.json({ success: true, feedback: feedback });
});


// 🚀 Start server
app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));