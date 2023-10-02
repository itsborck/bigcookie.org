// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyBgdTPdQjm6qoyVj14kimRbU2bQylT-Qa8",
  authDomain: "big-cookie-social-media.firebaseapp.com",
  projectId: "big-cookie-social-media",
  storageBucket: "big-cookie-social-media.appspot.com",
  messagingSenderId: "61491481624",
  appId: "1:61491481624:web:c3e2bfb10d4dc17774c76d",
  measurementId: "G-R9PDC4CKSQ"
};

firebase.initializeApp(firebaseConfig);

// Firebase Firestore
const db = firebase.firestore();
const auth = firebase.auth();

// DOM elements
const tweetText = document.getElementById('tweetText');
const postTweet = document.getElementById('postTweet');
const tweetList = document.getElementById('tweetList');

const userInfo = document.getElementById('userInfo');
const userPhoto = document.getElementById('userPhoto');
const userName = document.getElementById('userName');
const googleSignInButton = document.getElementById('googleSignIn');

// Initialize the Firestore listener immediately
let unsubscribe = db.collection('tweets')
    .orderBy('timestamp', 'desc')
    .onSnapshot((snapshot) => {
        tweetList.innerHTML = '';
        snapshot.forEach((doc) => {
            renderTweet(doc);
        });
    });

const maxTweetsPerMinute = 1;
let lastTweetTime = null;

// Function to render tweets
function renderTweet(doc) {
    const li = document.createElement('li');
    li.classList.add('tweet'); // Add the 'tweet' class

    // Create an image for the user's profile picture
    const userPhoto = document.createElement('img');
    userPhoto.classList.add('user-photo'); // Add the 'user-photo' class
    userPhoto.src = doc.data().userPhotoURL; // Set the image source
    userPhoto.alt = 'User Profile Picture';

    // Create a div for the tweet content
    const tweetContentDiv = document.createElement('div');
    tweetContentDiv.classList.add('tweet-content'); // Add the 'tweet-content' class

    // Create a span for the user's name
    const userName = document.createElement('span');
    userName.classList.add('user-name'); // Add the 'user-name' class
    userName.textContent = doc.data().userName; // Set the user's name

    // Create a paragraph for the tweet text
    const tweetText = document.createElement('p');
    tweetText.classList.add('tweet-text'); // Add the 'tweet-text' class
    tweetText.textContent = doc.data().text; // Set the tweet text

    // Create a comment input field
    const commentInput = document.createElement('input');
    commentInput.classList.add('comment-input');
    commentInput.placeholder = 'Add a comment';

    // Create a comment button
    const commentButton = document.createElement('button');
    commentButton.classList.add('comment-button');
    commentButton.textContent = 'Comment';

    // Attach a click event listener to the comment button
    commentButton.addEventListener('click', () => {
        const user = auth.currentUser;
        if (user) {
            const commentText = commentInput.value.trim();
            if (commentText !== '') {
                // Add the comment to Firestore
                db.collection('comments').add({
                    text: commentText,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    userId: user.uid,
                    tweetId: doc.id, // Associate the comment with the tweet
                })
                .then(() => {
                    // Comment added successfully, clear the comment input field
                    commentInput.value = '';    
                })
                .catch((error) => {
                    console.error('Error posting comment:', error);
                });
            }
        } else {
            alert('Please sign in to post a comment.');
        }
    });

    // Create a list to display comments
    const commentList = document.createElement('ul');
    commentList.classList.add('comment-list');

    // Create a span for the timestamp
    const timestampSpan = document.createElement('span');
    timestampSpan.classList.add('timestamp'); // Add the 'timestamp' class

    // Check if doc.data() is defined and if the 'timestamp' field exists
    if (doc.exists && doc.data().timestamp) {
        // Format the timestamp based on the user's local timezone
        const timestamp = doc.data().timestamp.toDate();
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        };
        
        const formattedTimestamp = new Intl.DateTimeFormat(undefined, options).format(timestamp);

        timestampSpan.textContent = formattedTimestamp; // Set the timestamp text
    }

    // Crete a delete button
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button'); // Add the 'delete-button' class
    deleteButton.textContent = 'Delete'; // Set the button text

    // Add a click event listener to the delete button
    deleteButton.addEventListener('click', () => {
        const user = auth.currentUser;
        if (user && user.uid === doc.data().userId) {
            // Only allow the user who posted the tweet to delete it
            db.collection('tweets').doc(doc.id).delete()
        }
    });

    // Append user info (image and name) and tweet text to the list item
    tweetContentDiv.appendChild(userName);
    tweetContentDiv.appendChild(tweetText);
    tweetContentDiv.appendChild(timestampSpan);
    tweetContentDiv.appendChild(deleteButton);
    tweetContentDiv.appendChild(commentInput);
    tweetContentDiv.appendChild(commentButton);
    tweetContentDiv.appendChild(commentList);
    li.appendChild(userPhoto);
    li.appendChild(tweetContentDiv);

    tweetList.appendChild(li);
}

function fetchCommentsForTweet(tweetId, commentList) {
    db.collection('tweets')
        .doc(tweetId)
        .collection('comments')
        .orderBy('timestamp')
        .onSnapshot((snapshot) => {
            commentList.innerHTML = '';
            snapshot.forEach((doc) => {
                const commentItem = document.createElement('li');
                commentItem.textContent = doc.data().text;
                commentList.appendChild(commentItem);
            });
        });
}

// Function to update user info in the UI
function updateUserUI(user) {
  if (user) {
      // User is signed in
      userInfo.style.display = 'block';
      userName.textContent = user.displayName;
      userPhoto.src = user.photoURL;
      googleSignInButton.style.display = 'none';
  } else {
      // User is signed out
      userInfo.style.display = 'none';
      userName.textContent = '';
      userPhoto.src = '';
      googleSignInButton.style.display = 'block';
  }
}

// Initialize Google Sign-In
const googleSignIn = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
      .then((result) => {
          // Google Sign-In successful
          const user = result.user;
          updateUserUI(user);

      })
      .catch((error) => {
          // Handle errors (e.g., user cancels sign-in)
          console.error('Google Sign-In Error:', error);
      });
};

// Event listener for Google Sign-In button
googleSignInButton.addEventListener('click', googleSignIn);

let tweetsLoaded = false;

auth.onAuthStateChanged((user) => {
    updateUserUI(user);

    if (user && !tweetsLoaded) {
        tweetsLoaded = true;
    }
});


// Event listener for posting a tweet
postTweet.addEventListener('click', () => {
    const text = tweetText.value.trim();
    if (text !== '') {
        const user = auth.currentUser;
        if (user) {
            // Check the rate limit
            const currentTime = new Date();
            if (!lastTweetTime || (currentTime - lastTweetTime) >= (60 * 1000) / maxTweetsPerMinute) {
                // User is within the rate limit, allow the tweet to be posted
                db.collection('tweets').add({
                    text: text,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    userId: user.uid,
                    userName: user.displayName,
                    userPhotoURL: user.photoURL,
                })
                .then(() => {
                    // Tweet added successfully, clear the text area and update lastTweetTime
                    tweetText.value = '';
                    lastTweetTime = currentTime;
                })
                .catch((error) => {
                    // Handle any errors that occur during tweet posting
                    console.error('Error posting:', error);
                });
            } else {
                // User is exceeding the rate limit
                alert('You are posting too quickly. Please wait a moment before posting again.');
            }
        } else {
            // User is not authenticated, handle this case as needed
            alert('Please sign in to post.');
        }
    }
});
