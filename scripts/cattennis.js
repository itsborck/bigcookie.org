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
  // panImage.style.top = `${725}px`; // Uncomment this line to lock the racket to the bottom of the screen
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
const scoreText = document.getElementById("score");

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

function playPlayerHitSound() {
  const playerHitSound = document.getElementById("playerHitSound");
  playerHitSound.volume = 0.25;
  playerHitSound.play();
}
function playOpponentHitSound() {
  const opponentHitSound = document.getElementById("opponentHitSound");
  opponentHitSound.volume = 0.25;
  opponentHitSound.play();
}
function playTennisTheme(){
  const tennisTheme = document.getElementById("tennisTheme");
  tennisTheme.volume = 0.05;
  tennisTheme.loop = true;
  tennisTheme.currentTime = .5;
  tennisTheme.play();
}
function stopTennisTheme(){
  const tennisTheme = document.getElementById("tennisTheme");
  tennisTheme.pause();
}



function checkBallInteraction() {
  if (isMouseOverElement() && ballY > 600 && ballVelY < 0 && gameOver == false) {
    ballVelX *= -1.015;
    ballVelY *= -1.015;
    score += 1;
    scoreText.innerHTML = score;
    playPlayerHitSound();
  } else if (ballY < 20 && ballVelY > 0) {
    ballVelX = Math.random() * 6 - 3;
    ballVelY *= -1;
    playOpponentHitSound();
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
    gameOver = true;
    panImage.style.display = "none";
    document.getElementById('start-game').style.display = "block";
    playTennisTheme();
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
let score = 0;
let gameOver = false;

// Start the game
function startGame() {
  score = 0;
  scoreText.innerHTML = score;
  ballwidth = 75;
  ballheight = 75;
  ballImage.width = ballwidth;
  ballImage.height = ballheight;
  ballX = (screenWidth - ballImage.width) / 2;
  ballY = 20;
  ballVelX = 0;
  ballVelY = -4;
  gameOver = false;
  stopTennisTheme();
  
  updateBallPosition();

  document.getElementById('start-game').style.display = "none";
  panImage.style.display = "block";
  animateBall();

  setInterval(checkBallInteraction, 100);
}