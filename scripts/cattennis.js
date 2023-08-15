window.addEventListener("load", function() {
  var preloader = document.querySelector(".preloader");
  preloader.classList.add("hide");
});

// Mousemove event to move the racket (pan) along with the cursor
document.addEventListener("mousemove", (event) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  panImage.style.left = `${mouseX}px`;
  panImage.style.top = `${mouseY}px`;
});

// Mousemove event to track the mouse position for ball interaction
document.addEventListener("mousemove", (event) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  // Update the flag based on whether the mouse is over the ball
  isMouseOverBall = isMouseOverElement();
});

const panImage = document.getElementById("racket");
const ballImage = document.getElementById("ball");

panImage.style.display = "none";

// Ball setup
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

let ballwidth = 75;
let ballheight = 75;
ballImage.width = ballwidth;
ballImage.height = ballheight;
let ballX = (screenWidth - ballImage.width) / 2;
let ballY = 20;

let ballVelX = 0;
let ballVelY = -4;

function updateBallPosition() {
  ballImage.style.transform = `translate(${ballX}px, ${ballY}px)`;
}

function moveBall(dx, dy) {
  ballX += dx;
  ballY -= dy;
  updateBallPosition();
}

function checkBallInteraction() {
  if (isMouseOverElement() && ballY > 600 && ballVelY < 0) {
    ballVelX *= -1;
    ballVelY *= -1;
  } else if (ballY < 20) {
    // ballVelX = Math.random() * 6 - 3;
    ballVelY *= -1;
  }
}

// Function to check if the mouse is over an element
function isMouseOverElement() {
  const rect = ballImage.getBoundingClientRect();
  const panrect = panImage.getBoundingClientRect();
  return (
    panrect.left+70 >= rect.left &&
    panrect.left+70 <= rect.right &&
    panrect.top+100 >= rect.top &&
    panrect.top+100 <= rect.bottom
  );
}

let animationId;
function animateBall() {
  moveBall(ballVelX, ballVelY);

  if (ballY < 650) {
    animationId = requestAnimationFrame(animateBall); // Continue the animation
  } else {
    cancelAnimationFrame(animationId); // Stop the animation when the Y value is reached
  }

  if (ballVelY < 0){
    ballwidth += .35;
    ballheight += .35;
    ballImage.width = ballwidth;
    ballImage.height = ballheight;
  } else if (ballVelY > 0){
    ballwidth -= .35;
    ballheight -= .35;
    ballImage.width = ballwidth;
    ballImage.height = ballheight;
  }

  checkBallInteraction();
}

updateBallPosition();

// Start the game
function startGame() {
  document.getElementById("start-game").style.display = "none";
  document.getElementById("racket").style.display = "block";
  animateBall();

  setInterval(checkBallInteraction, 100);
}
