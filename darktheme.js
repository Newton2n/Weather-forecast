let past_theme =localStorage.getItem("theme");

if(past_theme==="dark"){
  dark();
  document.body.classList.add("dark");
}
document.getElementById("theme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList == "dark" ? dark() : light();
  
});

function dark() {
  document.getElementById("dark").classList.remove("hidden1");
  document.getElementById("light").classList.add("hidden1");
  localStorage.setItem("theme","dark")
}
function light() {
  document.getElementById("dark").classList.add("hidden1");
  document.getElementById("light").classList.remove("hidden1");
   localStorage.setItem("theme","light")
}


