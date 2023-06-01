    // Initialize Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyCl8FoWIZ5y7xg2rYKngokJRkglfuMfGQE",
        authDomain: "big-cookie-login.firebaseapp.com",
        projectId: "big-cookie-login",
        storageBucket: "big-cookie-login.appspot.com",
        messagingSenderId: "491961115933",
        appId: "1:491961115933:web:a342e9957f4b1e960b6df4",
    };

    // Initialize Firebase with persistence enabled
    const firebaseApp = firebase.initializeApp(firebaseConfig);
    const auth = firebaseApp.auth();
    const database = firebaseApp.database();

    // Firebase references
    let messageRef;
    let isMessageListenerAttached = false;

    // Function to persist user's authentication state
    function persistAuthState(user) {
      if (user) {
        localStorage.setItem('chatAppUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('chatAppUser');
      }
    }

    // Function to restore user's authentication state
    function restoreAuthState() {
      return new Promise((resolve, reject) => {
        const storedUser = localStorage.getItem('chatAppUser');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user && user.uid) {
            resolve(user);
          } else {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      });
    }

    // Set local persistence for authentication
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
    .then(() => {
      // Check if a user is logged in and restore the authentication state
      restoreAuthState()
      .then(user => {
        if (user) {
          // User is logged in
          firebase.auth().onAuthStateChanged(currentUser => {
            if (currentUser) {
              // User is still logged in
              persistAuthState(currentUser);
              listenForMessages();
            } else {
              // User is logged out
              clearChatMessages();
            }
          });
        } else {
          // User is logged out
          clearChatMessages();
        }
      })
      .catch(error => {
        console.log(error.message);
      });
  })
  .catch(error => {
    console.log(error.message);
  });

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
        if (message.length <= 256) {
        const messageData = {
          text: message,
          timestamp: Date.now(),
          userId: user.uid,
          userName: user.displayName
        };

        database.ref("messages").push(messageData)
          .then(() => {
            document.getElementById("messageField").value = "";
            document.getElementById("errorMessage").style.display = "none";
          })
          .catch(error => {
            cosole.log(error.message);
          });
        } else {
          document.getElementById("errorMessage").textContent = "Message should not exceed 256 characters.";
          document.getElementById("errorMessage").style.display = "block";
        }
      }
    }
    // Listen for new messages
    function listenForMessages() {
      if (!isMessageListenerAttached) {
        messageRef = database.ref("messages");
        
        messageRef.on("child_added", snapshot => {
          const messageData = snapshot.val();
          const chatMessages = document.getElementById("chatMessages");

          const messageElement = document.createElement("div");
          messageElement.textContent = `${messageData.userName}: ${messageData.text}`;

          chatMessages.appendChild(messageElement);

          // Scroll to the latest message
          chatMessages.scrollTop = chatMessages.scrollHeight;
        });
        
        isMessageListenerAttached = true;
      }
    }

    // Clear chat messages
    function clearChatMessages() {
      document.getElementById("chatMessages").innerHTML = "";
    }