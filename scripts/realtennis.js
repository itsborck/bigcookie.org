document.addEventListener('contextmenu', event => event.preventDefault());

document.onkeydown = (e) => {
  if (e.key == 123) {
      e.preventDefault();
  }
  if (e.ctrlKey && e.shiftKey && e.key == 'I') {
      e.preventDefault();
  }
  if (e.ctrlKey && e.shiftKey && e.key == 'C') {
      e.preventDefault();
  }
  if (e.ctrlKey && e.shiftKey && e.key == 'J') {
      e.preventDefault();
  }
  if (e.ctrlKey && e.key == 'U') {
      e.preventDefault();
  }
};

var firebaseConfig = {
  apiKey: "AIzaSyCplI9U1goCZKToI0xGnLfJn4XsgqkhTHM",
  authDomain: "leaderboard-44fa9.firebaseapp.com",
  databaseURL: "https://leaderboard-44fa9-default-rtdb.firebaseio.com",
  projectId: "leaderboard-44fa9",
  storageBucket: "leaderboard-44fa9.appspot.com",
  messagingSenderId: "799491604833",
  appId: "1:799491604833:web:9e9bbff6701edd15cd0520",
  measurementId: "G-GMW6Y7SH34"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();
var scoresRef = database.ref("scores");

document.getElementById('google-signin').addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      // Handle successful sign-in
      const user = result.user;
      document.getElementById("user-name").textContent = "Hello, " + user.displayName;

      // Hide the sign-in button
      document.getElementById('google-signin').style.display = 'none';
      // Show the sign-out button
      document.getElementById('sign-out-button').style.display = 'block';

      window.location.reload();
    })
    .catch((error) => {
      // Handle errors
      console.error(error);
    });
});

document.getElementById('sign-out-button').addEventListener('click', () => {
  firebase.auth().signOut().then(() => {
    // Reset UI after sign out
    document.getElementById("user-name").textContent = "";
    document.getElementById('google-signin').style.display = 'block';
    document.getElementById('sign-out-button').style.display = 'none';

    window.location.reload();
  })
  .catch((error) => {
    console.error(error);
  });
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    document.getElementById("user-name").textContent = "Hello, " + user.displayName;
    document.getElementById('google-signin').style.display = 'none';
    document.getElementById('sign-out-button').style.display = 'block';
    document.getElementById('start-game').style.display = 'block';
  } else {
    // User is not signed in
    document.getElementById("user-name").textContent = "";
    document.getElementById('google-signin').style.display = 'block';
    document.getElementById('sign-out-button').style.display = 'none';
    document.getElementById('start-game').style.display = 'none';
  }
});

window.addEventListener("load", function() {
  var preloader = document.querySelector(".preloader");
  preloader.classList.add("hide");
  
  this.setTimeout(playTennisTheme, 1000);
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
  // playerHitSound.volume = 0.25;
  playerHitSound.play();
}
function playOpponentHitSound() {
  const opponentHitSound = document.getElementById("opponentHitSound");
  opponentHitSound.play();
}
function playTennisTheme(){
  const tennisTheme = document.getElementById("tennisTheme");
  // tennisTheme.volume = 0.05;
  tennisTheme.loop = true;
  tennisTheme.currentTime = .5;
  tennisTheme.play();
}
function stopTennisTheme(){
  const tennisTheme = document.getElementById("tennisTheme");
  tennisTheme.pause();
}

let audioMuted = false;
function muteAudio(){
  const tennisTheme = document.getElementById("tennisTheme");
  const playerHitSound = document.getElementById("playerHitSound");
  const opponentHitSound = document.getElementById("opponentHitSound");
  audioMuted = !audioMuted;
  if (audioMuted){
    document.getElementById("mute-audio").innerHTML = "Unmute Audio";
    tennisTheme.muted = true;
    playerHitSound.muted = true;
    opponentHitSound.muted = true;
  } else {
    document.getElementById("mute-audio").innerHTML = "Mute Audio";
    tennisTheme.muted = false;
    playerHitSound.muted = false;
    opponentHitSound.muted = false;
  }
}
function adjustVolume() {
  const tennisTheme = document.getElementById("tennisTheme");
  const playerHitSound = document.getElementById("playerHitSound");
  const opponentHitSound = document.getElementById("opponentHitSound");
  const volumeSlider = document.getElementById("volume-slider");
  
  const volume = parseFloat(volumeSlider.value);
  
  tennisTheme.volume = volume * .2;
  playerHitSound.volume = volume * .7;
  opponentHitSound.volume = volume * .7;
}


function checkBallInteraction() {
  if (isMouseOverElement() && ballY > 600 && ballVelY < 0 && isGameOver == false) {
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

let lastTimestamp = 0;
const frameInterval = 1000 / 144; // 60 FPS

function animateBall(timestamp) {
  if (!isGameOver && timestamp - lastTimestamp >= frameInterval) {
    lastTimestamp = timestamp;

  moveBall(ballVelX, ballVelY);

  if (ballY < 650) {
    requestAnimationFrame(animateBall); // Continue the animation
  } else {
    isGameOver = true;
    cancelAnimationFrame(animationId); // Stop the animation when the Y value is reached
    updateLeaderboard(score);
    panImage.style.display = "none";
    document.getElementById('start-game').style.display = "block";
    if (score == 69){
      alert("Nice.");
    }
    if (Math.floor(Math.random() * 100) + 1 == 50){
      window.open("https://www.youtube.com/watch?v=OL94hTjUX7c")
    } else {
      playTennisTheme();
    }

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
  animationId = requestAnimationFrame(animateBall);
}


updateBallPosition();
adjustVolume();
let score = 0;
let isGameOver = false;


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
  isGameOver = false;
  stopTennisTheme();
  
  updateBallPosition();

  document.getElementById('start-game').style.display = "none";
  panImage.style.display = "block";

  let animationId = requestAnimationFrame(animateBall);

  setInterval(checkBallInteraction, 100);
}

function updateLeaderboard(score) {
  var user = firebase.auth().currentUser;

  if (user && score > 0 && score <= 999) {
    var database = firebase.database();
    var scoresRef = database.ref("scores");

    scoresRef.push({
      score: score,
      name: user.displayName,
    });
  } else {
    console.log("Score is zero, user is not authenticated, or score is greater than 999. Not updating leaderboard.");
  }
}


var leaderboardList = document.getElementById("leaderboard-list");

scoresRef.orderByChild("score").limitToLast(10).on("value", function(snapshot) {
  leaderboardList.innerHTML = ""; // Clear previous entries

  if (snapshot.exists()) {
    var scoreArray = [];
    snapshot.forEach(function(childSnapshot) {
      scoreArray.push(childSnapshot.val());
    });

    scoreArray.sort((a, b) => b.score - a.score); // Sort scores in descending order

    scoreArray.forEach(function(scoreData) {
      var listItem = document.createElement("li");
      listItem.textContent = scoreData.name + ": " + scoreData.score; // Display name and score
      leaderboardList.appendChild(listItem);
    });
  } else {
    var messageItem = document.createElement("li");
    messageItem.textContent = "No scores yet"; // Display a message for empty leaderboard
    leaderboardList.appendChild(messageItem);
  }
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("User is logged in:", user);
  } else {
    console.log("User is not logged in.");
  }
});