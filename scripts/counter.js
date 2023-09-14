// Initialize Firebase with your Firebase project configuration
var firebaseConfig = {
  apiKey: "AIzaSyCij6QEZ8GiOlOAeBOKX5e4VpmRqJGxHVk",
  authDomain: "big-cookie-counter.firebaseapp.com",
  projectId: "big-cookie-counter",
  storageBucket: "big-cookie-counter.appspot.com",
  messagingSenderId: "126306869803",
  appId: "1:126306869803:web:f0b52fbcabc00c717c406e",
  measurementId: "G-P1DHMY80CW"
};

firebase.initializeApp(firebaseConfig);

// Get a reference to the Firestore database
const db = firebase.firestore();

const countElement = document.getElementById('count');
const incrementBtn = document.getElementById('incrementBtn');
const decrementBtn = document.getElementById('decrementBtn');


// Load the initial count value from Firestore
db.collection('counters').doc('counter1').get()
  .then((doc) => {
      if (doc.exists) {
          const count = doc.data().count;
          countElement.textContent = count;
      } else {
          // If the document doesn't exist, create it with an initial count of 0
          db.collection('counters').doc('counter1').set({ count: 0 });
      }
  })
  .catch((error) => {
      console.error('Error loading count: ', error);
  });

// Increment the count and update Firestore when the button is clicked
function incrementCounter() {
  db.collection('counters')
      .doc('counter1')
      .get()
      .then((doc) => {
          if (doc.exists) {
              let count = doc.data().count;
              if (count >= 0) {
                  count++; // Decrement only if count is greater than 0
              }
              countElement.textContent = count;

              // Update the count in Firestore
              return db.collection('counters').doc('counter1').update({ count });
          }
      })
      .catch((error) => {
          console.error('Error incrementing counter:', error);
      });
}

// Add a click event listener to the increment button
incrementBtn.addEventListener('click', incrementCounter);

// Decrement the count and update Firestore when the button is clicked
function decrementCounter() {
  db.collection('counters')
      .doc('counter1')
      .get()
      .then((doc) => {
          if (doc.exists) {
              let count = doc.data().count;
              if (count > 0) {
                  count--; // Decrement only if count is greater than 0
              }
              countElement.textContent = count;

              // Update the count in Firestore
              return db.collection('counters').doc('counter1').update({ count });
          }
      })
      .catch((error) => {
          console.error('Error decrementing counter:', error);
      });
}

// Add a click event listener to the decrement button
decrementBtn.addEventListener('click', decrementCounter);