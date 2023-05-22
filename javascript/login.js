// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { 
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
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
const auth = getAuth();

// Getting All the Objects of html
var email = document.getElementById("email");
var passwords = document.getElementById("password");

// making a function for storing data
window.login = function(e) {
  e.preventDefault();
  var obj = {
    email:email.value,
    password:passwords.value,
  }
  signInWithEmailAndPassword(auth, obj.email, obj.password)
  .then(function (success) {
    alert("Login Successful")
    var aaaa = (success.user.uid);
    localStorage.setItem("uid", aaaa)
    console.log(aaaa)
  
    window.location.replace('index.html')
  })
  .catch(function (err) {
    alert("Login Error"+ err);
  });

  console.log(obj);
}