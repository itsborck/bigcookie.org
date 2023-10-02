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

function checkUserPermission() {
    const user = firebase.auth().currentUser;
    if (user && user.uid === 'kj8RsHRLYNUWXC3ZACfBSLgbv2G3', 'JO2J5OF2byZpInjiyu8Y5W3X39C3') {
        incrementBtn.disabled = false;
        decrementBtn.disabled = false;
    } else {
        incrementBtn.disabled = true;
        decrementBtn.disabled = true;
        document.getElementById('incrementBtn').style.display = 'none';
        document.getElementById('decrementBtn').style.display = 'none';
    }
}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, check permissions
        checkUserPermission();
        saveUidToFirestore(user.uid);
        document.getElementById('google-signin').style.display = 'none';
        document.getElementById('sign-out-button').style.display = 'block';
        document.getElementById('incrementBtn').style.display = 'block';
        document.getElementById('decrementBtn').style.display = 'block';
    } else {
        // User is signed out, disable buttons
        incrementBtn.disabled = true;
        decrementBtn.disabled = true;
        document.getElementById('google-signin').style.display = 'block';
        document.getElementById('sign-out-button').style.display = 'none';
        document.getElementById('incrementBtn').style.display = 'none';
        document.getElementById('decrementBtn').style.display = 'none';
        window.alert("Unauthorized User!");
    }
});

function saveUidToFirestore(uid) {
    db.collection('users').doc(uid).set({ uid: uid })
    .then(() => {
        console.log('User saved to Firestore');
    })
    .catch((error) => {
        console.error('Error saving user to Firestore: ', error);
    });
}

document.getElementById('google-signin').addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then((result) => {
        checkUserPermission();
        // Hide the sign-in button
        document.getElementById('google-signin').style.display = 'none';
        // Show the sign-out button
        document.getElementById('sign-out-button').style.display = 'block';
    })
    .catch((error) => {
        // Handle errors
        console.error(error);
    });
});

document.getElementById('sign-out-button').addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
        checkUserPermission();
        // Reset UI after sign out
        document.getElementById('google-signin').style.display = 'block';
        document.getElementById('sign-out-button').style.display = 'none';

        window.location.reload();
    })
    .catch((error) => {
    console.error(error);
    });
});


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