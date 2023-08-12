window.addEventListener("load", function() {
    var preloader = document.querySelector(".preloader");
    preloader.classList.add("hide");
  });

// Get the floating image element
const floatingImage = document.getElementById("floatingImage");

document.addEventListener("mousemove", (event) => {
// Get the current mouse position
const mouseX = event.clientX;
const mouseY = event.clientY;

// Set the image position to follow the cursor
floatingImage.style.left = `${mouseX}px`;
floatingImage.style.top = `${mouseY}px`;
});

function startGame(){
}