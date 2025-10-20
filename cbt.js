 function enter() {
   const nam = document.getElementById("name");
   const rg = document.getElementById("reg");
   const ho = document.getElementById("hof");
   
   const name = nam.value.trim();
   const reg = rg.value.trim();
   
   if (!name || !reg) {
     ho.innerText = "Name and Reg. no required!";
     ho.style.color = "red";
     
     setTimeout(() => {
       ho.innerText = "";
     }, 1000);
     
     return;
   }
   
   ho.innerText = "";
   
   localStorage.setItem("name", name);
   localStorage.setItem("regNumber", reg);
   
   window.location.href = "quiz.html";
 }