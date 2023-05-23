const firebaseConfig = {
    apiKey: "AIzaSyCl8FoWIZ5y7xg2rYKngokJRkglfuMfGQE",
    authDomain: "big-cookie-login.firebaseapp.com",
    projectId: "big-cookie-login",
    storageBucket: "big-cookie-login.appspot.com",
    messagingSenderId: "491961115933",
    appId: "1:491961115933:web:a342e9957f4b1e960b6df4",
};

firebase.initializeApp(firebaseConfig);

// Firebase references
const auth = firebase.auth();
const database = firebase.database().ref("chat");

// Login function
function login() {
  const email = document.getElementById("emailField").value;
  const password = document.getElementById("passwordField").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("loginDiv").style.display = "none";
      document.getElementById("chatDiv").style.display = "block";
      listenForMessages();
    })
    .catch(error => {
      document.getElementById("loginError").innerText = error.message;
    });
}

// Login with Google function
function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
    .then(result => {
      document.getElementById("loginDiv").style.display = "none";
      document.getElementById("chatDiv").style.display = "block";
      listenForMessages();
    })
    .catch(error => {
      document.getElementById("loginError").innerText = error.message;
    });
}

// Logout function
function logout() {
  auth.signOut()
    .then(() => {
      document.getElementById("loginDiv").style.display = "block";
      document.getElementById("chatDiv").style.display = "none";
      document.getElementById("chatMessages").innerHTML = "";
    })
    .catch(error => {
      console.log(error.message);
    });
}

// Send message function
function sendMessage() {
  const message = document.getElementById("messageField").value;
  const user = auth.currentUser;

  if (message && user) {
    const messageData = {
      text: message,
      timestamp: Date.now(),
      userId: user.uid,
      userName: user.displayName
    };

    database.push(messageData);
    document.getElementById("messageField").value = "";
  }
}

// Listen for new messages
function listenForMessages() {
  database.on("child_added", snapshot => {
    const message = snapshot.val();
    const messageElement = document.createElement("p");
    messageElement.innerHTML = `<strong>${message.userName}:</strong> ${message.text}`;
    document.getElementById("chatMessages").appendChild(messageElement);
  });
}

// Check if user is logged in
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("loginDiv").style.display = "none";
    document.getElementById("chatDiv").style.display = "block";
    listenForMessages();
  } else {
    document.getElementById("loginDiv").style.display = "block";
    document.getElementById("chatDiv").style.display = "none";
    document.getElementById("chatMessages").innerHTML = "";
  }
});