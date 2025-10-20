// ====================== SETUP ======================

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // serve your HTML, CSS, JS files

// ====================== IN-MEMORY STORAGE ======================

// Stores users who have taken the quiz
// Format: { regNumber: { name: string, score: number } }
let userScores = {};

// Hardcoded quiz code for Step 2
const QUIZ_CODE = "12345";

// ====================== ROUTES ======================

// Step 2: Validate quiz code and check if user already has a score
app.post("/validate-quiz", (req, res) => {
  const { name, regNumber, quizCode } = req.body;

  if (!name || !regNumber || !quizCode) {
    return res.json({ success: false, message: "Missing fields" });
  }

  // Check quiz code
  if (quizCode !== QUIZ_CODE) {
    return res.json({ success: false, message: "Quiz code incorrect" });
  }

  // Check if user has already taken the quiz
  if (userScores[regNumber]) {
    return res.json({ success: false, message: "Score has already been registered for this user" });
  }

  // Access granted
  res.json({ success: true });
});

// Step 3: Submit quiz score
app.post("/submit-quiz", (req, res) => {
  const { name, regNumber, score } = req.body;

  if (!name || !regNumber || score === undefined) {
    return res.json({ success: false, message: "Missing submission data" });
  }

  // Prevent double submission
  if (userScores[regNumber]) {
    return res.json({ success: false, message: "Score already submitted" });
  }

  // Save score
  userScores[regNumber] = { name, score };

  res.json({ success: true, message: `Quiz submitted! Score: ${score}` });
});

// ====================== START SERVER ======================

app.listen(PORT, () => {
  console.log(`CBT server running on http://localhost:${PORT}`);
});