// ====================== CONFIG ======================

// Quiz duration in seconds (10 minutes)
const totalTime = 600;

// Questions array (use your real questions)
const questions = [
  {
    question: "All but one is not an example of structural buildings",
    options: ["Soil", "Water", "Silo", "Barn"],
    correct: "C"
  },
  {
    question: "Question 2 example?",
    options: ["A", "B", "C", "D"],
    correct: "A"
  },
  // Add more questions here
];

// ====================== STATE ======================

let currentQuestion = 0;
let answers = Array(questions.length).fill(null);
let remainingTime = localStorage.getItem("quizTime") 
                    ? parseInt(localStorage.getItem("quizTime")) 
                    : totalTime;

// ====================== ELEMENTS ======================

const timerEl = document.getElementById("timer");
const questionText = document.querySelector(".question p:nth-child(2)");
const optionCards = document.querySelectorAll(".option-card span");
const radioInputs = document.querySelectorAll("input[name='option']");
const prevBtn = document.querySelector(".but-container button:first-child");
const nextBtn = document.querySelector(".but-container button:last-child");

// ====================== ACCESS CHECK ======================

if (localStorage.getItem("AccessGranted") !== "true") {
  window.location.href = "quiz.html"; // redirect to Step 2
}

// ====================== TIMER ======================

function startTimer() {
  const interval = setInterval(() => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    timerEl.innerText = `Time left: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    remainingTime--;
    localStorage.setItem("quizTime", remainingTime);

    if (remainingTime <= 0) {
      clearInterval(interval);
      localStorage.removeItem("quizTime");
      alert("Time's up!");
      submitQuiz();
    }
  }, 1000);
}

// ====================== QUESTION RENDERING ======================

function renderQuestion() {
  const q = questions[currentQuestion];
  questionText.innerText = q.question;

  // Populate options
  q.options.forEach((opt, i) => {
    optionCards[i].innerText = `${String.fromCharCode(65 + i)}. ${opt}`;
    radioInputs[i].value = String.fromCharCode(65 + i);
  });

  // Restore previous answer if exists
  if (answers[currentQuestion]) {
    radioInputs.forEach(r => r.checked = r.value === answers[currentQuestion]);
  } else {
    radioInputs.forEach(r => r.checked = false);
  }

  // Handle buttons visibility
  prevBtn.style.display = currentQuestion === 0 ? "none" : "inline-block";
  if (currentQuestion === questions.length - 1) {
    nextBtn.innerText = "Submit";
  } else {
    nextBtn.innerText = "Next";
  }
}

// ====================== NAVIGATION ======================

function saveAnswer() {
  const selected = document.querySelector("input[name='option']:checked");
  answers[currentQuestion] = selected ? selected.value : null;
}

prevBtn.addEventListener("click", () => {
  saveAnswer();
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
});

nextBtn.addEventListener("click", () => {
  saveAnswer();
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    submitQuiz();
  }
});

// ====================== SUBMISSION ======================

function submitQuiz() {
  const name = localStorage.getItem("name");
  const regNumber = localStorage.getItem("regNumber");

  // Example score calculation
  let score = 0;
  answers.forEach((ans, i) => {
    if (ans === questions[i].correct) score++;
  });

  fetch("/submit-quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, regNumber, score })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    localStorage.removeItem("AccessGranted");
    localStorage.removeItem("quizTime");
    window.location.href = "cbt.html"; // go back to start
  })
  .catch(err => console.error(err));
}

// ====================== INIT ======================

window.onload = () => {
  renderQuestion();
  startTimer();
};