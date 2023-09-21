window.addEventListener("load", function() {
    var preloader = document.querySelector(".preloader");
    preloader.classList.add("hide");
});

window.addEventListener("scroll", function() {
    var navbar = document.querySelector(".navbar");
    if (window.scrollY >= document.querySelector(".hero-image").offsetHeight) {
        navbar.classList.add("sticky");
    } else {
        navbar.classList.remove("sticky");
    }
})

function myFunction() {
    var x = document.getElementById("myNavbar");
    if (x.className === "navbar") {
        x.className += " responsive";
    } else {
        x.className = "navbar";
    }
}

function scrollToGamesSection() {
    const gamesSection = document.getElementById("games");

    // Scroll smoothly to the games section
    if (gamesSection) {
        gamesSection.scrollIntoView({ behavior: "smooth" });
    }
}

function scrollToCookies() {
    const cookieSection = document.getElementById("cookies");

    // Scroll smoothly to the games section
    if (cookieSection) {
        cookieSection.scrollIntoView({ behavior: "smooth" });
    }
}