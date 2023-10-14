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

window.addEventListener("scroll", function() {
    const rows = document.querySelectorAll(".row");

    rows.forEach(row => {
        const left = document.querySelector(".left");
        const right = document.querySelector(".right");
        const scrollPosition = window.scrollY;

        left.style.transform = `translateY(${scrollPosition * 0.1}px)`;
        right.style.transform = `translateY(${scrollPosition * 0.6}px)`;
    });
});