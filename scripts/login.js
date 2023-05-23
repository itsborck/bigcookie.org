// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, updateProfile } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCl8FoWIZ5y7xg2rYKngokJRkglfuMfGQE",
  authDomain: "big-cookie-login.firebaseapp.com",
  projectId: "big-cookie-login",
  storageBucket: "big-cookie-login.appspot.com",
  messagingSenderId: "491961115933",
  appId: "1:491961115933:web:a342e9957f4b1e960b6df4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider(app);
const user = auth.currentUser;

signInWithGoogle.addEventListener('click', (e) => {
  signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    
    window.location.replace('index.html') 
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;

    const email = error.email;

    const credential = GoogleAuthProvider.credentialFromError(error);
  });
});

if (user !== null) {
  const displayName = user.displayName;
  const email = user.email;
  const photoURL = user.photoURL;
  const emailVerified = user.emailVerified;
}

