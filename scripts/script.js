window.addEventListener("load", function() {
    var preloader = document.querySelector(".preloader");
    preloader.classList.add("hide");
  });

function toggleDarkMode() {
    var body = document.body;
    body.classList.toggle("dark-mode");
}

function myFunction() {
    var x = document.getElementById("myNavbar");
    if (x.className === "navbar") {
        x.className += " responsive";
    } else {
        x.className = "navbar";
    }
}

document.getElementById("dropdown").addEventListener("click", function(event) {
    if (event.target !== this) {
        this.style.display = "none";
    }
});