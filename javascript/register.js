  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
  import {
    getAuth,
    createUserWithEmailAndPassword,
  } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCl8FoWIZ5y7xg2rYKngokJRkglfuMfGQE",
    authDomain: "big-cookie-login.firebaseapp.com",
    projectId: "big-cookie-login",
    storageBucket: "big-cookie-login.appspot.com",
    messagingSenderId: "491961115933",
    appId: "1:491961115933:web:a342e9957f4b1e960b6df4"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth()


var username = document.getElementById("username");
var email = document.getElementById("email");
var password = document.getElementById("password");

window.signup = function (e) {
if(password)

    if(username.value == "" || email.value =="" || password.value ==""){
        alert("All Field Are Required")
    }

    e.preventDefault();
    var obj = {
      username: username.value,
      email: email.value,
      password: password.value,
    };
  
    createUserWithEmailAndPassword(auth, obj.email, obj.password)
    .then(function(success){
        window.location.replace('login.html')
      // console.log(success.user.uid)
      alert("signup successfully")
    })
    .catch(function(err){
      alert("Error in " + err)
    });
   console.log()
    console.log(obj);
  };