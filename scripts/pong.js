//preloader
window.addEventListener("load", function() {
    var preloader = document.querySelector(".preloader");
    preloader.classList.add("hide");
  });

//------------------------------------------------------------------------------------------------------------------------------------------------------
// images
const ballImage = document.getElementById("ball");
const leftPaddleImage = document.getElementById("paddle");
const rightPaddleImage = document.getElementById("paddle2");

// screen size
let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight - 60;

// Ball setup
let ballWidth = 75;
let ballHeight = 75;
ballImage.width = ballWidth;
ballImage.height = ballHeight;

let ballX = screenWidth/2 - ballWidth/2;
let ballY = screenHeight/2 - ballHeight/2;

let ballVelX = -screenWidth/480;
let ballVelY = screenHeight/270;

// Left paddle setup
let leftPaddleX = 0;
let leftPaddleY;

// Right paddle setup
let rightPaddleY = ballY - ballHeight/2;
let rightPaddleX = screenWidth - rightPaddleImage.width;

// Framerate
let lastTimestamp = 0;
const frameInterval = 1000 / 144;


//------------------------------------------------------------------------------------------------------------------------------------------------------
// Left paddle movement
document.addEventListener('mousemove', (event) => {
    const mouseY = event.clientY;
    leftPaddleY = mouseY - leftPaddleImage.height / 2;

    if (leftPaddleY >= 60) {
        leftPaddleImage.style.top = `${leftPaddleY}px`;
    } else {
        leftPaddleImage.style.top = "60px";
    }
});

// Right paddle movement
function updateRightPaddlePosition() {
    if (rightPaddleY >= 60) {
        rightPaddleImage.style.top = `${rightPaddleY}px`;
        rightPaddleImage.style.left = `${rightPaddleX}px`;
    } else {
        rightPaddleImage.style.top = "60px";
        rightPaddleImage.style.left = `${rightPaddleX}px`;
    }
}

function moveRightPaddle(dy) {
    rightPaddleY += dy;
    updateRightPaddlePosition();
}

//you get the point
let rightPaddleAnimationId;
function animateRightPaddle() {
    if (ballY > rightPaddleY) {
        moveRightPaddle(3.5);
    } else if (ballY < rightPaddleY) {
        moveRightPaddle(-3.5);
    }

    rightPaddleAnimationId = requestAnimationFrame(animateRightPaddle); 
    // cancelAnimationFrame(animationId); //cancel the animation stop the ball
}



















function updateBallPosition() {
    ballImage.style.transform = `translate(${ballX}px, ${ballY}px)`;
}

function moveBall(dx, dy) {
    ballX += dx;
    ballY -= dy;
    updateBallPosition();
}

let ballAnimationId;
let ballRect = ballImage.getBoundingClientRect();
let leftPaddleRect = leftPaddleImage.getBoundingClientRect();
let rightPaddleRect = rightPaddleImage.getBoundingClientRect();

function animateBall(timestamp) {
    const elapsed = timestamp - lastTimestamp;
    ballAnimationId = requestAnimationFrame(animateBall);

    if (elapsed >= frameInterval) {
        lastTimestamp = timestamp;
    
        moveBall(ballVelX, ballVelY);
        ballRect = ballImage.getBoundingClientRect();
        leftPaddleRect = leftPaddleImage.getBoundingClientRect();
        rightPaddleRect = rightPaddleImage.getBoundingClientRect();
    
        //collision detection
        if (ballY <= 0 || ballY + ballHeight >= screenHeight) {
            ballVelY *= -1;
        }
    
        if (ballX <= 0){
            if (ballRect.bottom >= leftPaddleRect.top && ballRect.top <= leftPaddleRect.bottom){
                ballVelX *= -1;
            } else {
                endGame();
            }
        }
        if (ballX + ballWidth >= screenWidth){
            if (ballRect.bottom >= rightPaddleRect.top && ballRect.top <= rightPaddleRect.bottom){
                ballVelX *= -1;
            } else {
                endGame();
            }
        }
    }

}

function endGame() {
    cancelAnimationFrame(ballAnimationId);
}


function resetGame(){
    cancelAnimationFrame(ballAnimationId);
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight - 60;

    ballX = screenWidth/2 - ballWidth/2;
    ballY = screenHeight/2 - ballHeight/2;
    ballVelX = -screenWidth/480;
    ballVelY = screenHeight/270;
    leftPaddleY = screenHeight/2 - leftPaddleImage.height/2;
    rightPaddleX = screenWidth - rightPaddleImage.width;
    rightPaddleY = screenHeight/2 - rightPaddleImage.height/2;
    updateBallPosition();
    updateRightPaddlePosition();
    animateBall();
    animateRightPaddle();
}

// Start the game
function startGame() {
    resetGame();
    lastTimestamp = performance.now();
    animateBall(lastTimestamp);

    leftPaddleImage.style.display = "block";
    rightPaddleImage.style.display = "block";

    requestAnimationFrame(limitFrameRate);
}

updateBallPosition();
updateRightPaddlePosition();
animateRightPaddle();