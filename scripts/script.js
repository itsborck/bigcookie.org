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