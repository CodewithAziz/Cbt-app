function start() {
  const qui = document.getElementById("quiz");
  const spa = document.getElementById("span");
  
  const quiz = qui.value.trim();
  const code = "12345";
  
  const name = localStorage.getItem("name")
  const regNumber = localStorage.getItem("regNumber")
  
  if (!name || !regNumber) {
    window.location.href ="cbt.html";
    return;
  }
  
  if (!quiz) {
    spa.innerText = "Enter quiz code";
    spa.style.color = "red";
    
    setTimeout(() => {
      spa.innerText = "";
    }, 1000);
    
    return;
  }
  
  if (quiz !== code) {
    spa.innerText = "Quiz Code incorrect!";
    spa.style.color = "red";
    
    setTimeout(() => {
      spa.innerText = "";
    }, 1000);
    
    return;
  }

  fetch ("/validate-quiz", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({name, regNumber, quizCode: quiz})
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
    localStorage.setItem("AccessGranted", "true");
    window.location.href = "app.html";
}

else {
  spa.innerText = data.message;
  spa.style.color = "red";
  setTimeout (() => {
    spa.innerText="";
  }, 1000);
}
  })


.catch(err => console.error(err));
}