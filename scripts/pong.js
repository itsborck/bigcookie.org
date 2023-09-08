//preloader
window.addEventListener("load", function() {
    var preloader = document.querySelector(".preloader");
    preloader.classList.add("hide");
  });

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

// Ball setup
const ballImage = document.getElementById("ball");

let ballwidth = 75;
let ballheight = 75;
ballImage.width = ballwidth;
ballImage.height = ballheight;

let ballX = (screenWidth - ballImage.width) / 2;
let ballY = 20;

let ballVelX = -4;
let ballVelY = 4;

function updateBallPosition() {
ballImage.style.transform = `translate(${ballX}px, ${ballY}px)`;
}

function moveBall(dx, dy) {
ballX += dx;
ballY -= dy;
updateBallPosition();
}

let ballAnimationId;
function animateBall() {
    moveBall(ballVelX, ballVelY);
    if (ballX + (ballwidth/2) >= screenWidth){
        ballVelX = -ballVelX; 
    } else if (ballX + (ballwidth/2) <= 0){
        ballVelX = -ballVelX;
    } else if (ballY + (ballheight/2) >= screenHeight){
        ballVelY = -ballVelY;
    } else if (ballY + (ballheight/2) <= 0){
        ballVelY = -ballVelY;
    }
    ballAnimationId = requestAnimationFrame(animateBall); 
    // cancelAnimationFrame(animationId); //cancel the animation stop the ball
}

//pan setup
const leftPanImage = document.getElementById("racket");
const rightPanImage = document.getElementById("racket2");
// Mousemove event to move the racket (pan) along with the cursor
document.addEventListener("mousemove", (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    leftPanImage.style.top = `${mouseY}px`;
    leftPanImage.style.left = `${10}px`; // Uncomment this line to lock the racket to the bottom of the screen
});

let OpponentPanY = ballY + 50;
let OpponentPanX = screenWidth - 10;
let OpponentPanVelX = 0;
let OpponentPanVelY = 0;

function updateOpponentPanPosition() {
    rightPanImage.style.transform = `translate(${OpponentPanX}px, ${OpponentPanY}px)`;
}

function moveOpponentPan(dy) {
    OpponentPanY -= dy;
    updateOpponentPanPosition();
}

//you get the point
let opponentPanAnimationId;
function animateOpponentPan() {
    if (ballY > OpponentPanY) {
        moveOpponentPan(-3.5);
    } else if (ballY < OpponentPanY) {
        moveOpponentPan(3.5);
    }

    opponentPanAnimationIdAnimationId = requestAnimationFrame(animateOpponentPan); 
    // cancelAnimationFrame(animationId); //cancel the animation stop the ball
}




updateBallPosition();
updateOpponentPanPosition();
let gameOver = false;



// Start the game
function startGame() {
    updateBallPosition();
    updateOpponentPanPosition();

    leftPanImage.style.display = "block";
    rightPanImage.style.display = "block";
    animateBall();
    animateOpponentPan();
}