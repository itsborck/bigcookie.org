window.addEventListener("load", function() {
    var preloader = document.querySelector(".preloader");
    preloader.classList.add("hide");
  });

function myFunction() {
    var x = document.getElementById("myNavbar");
    if (x.className === "navbar") {
        x.className += " responsive";
    } else {
        x.className = "navbar";
    }
}