const firebaseConfig = {
  apiKey: "AIzaSyBFci0rxBV9PqN8dO4-vqEl4NCwcSJoqNI",
  authDomain: "big-cookie-gallery.firebaseapp.com",
  projectId: "big-cookie-gallery",
  storageBucket: "big-cookie-gallery.appspot.com",
  messagingSenderId: "1028185106502",
  appId: "1:1028185106502:web:f4dafbbce8fa0cd87bc247",
  measurementId: "G-9MTQN4LMJH"
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

const googleProvider = new firebase.auth.GoogleAuthProvider();

const googleSignInButton = document.getElementById('google-signin');

googleSignInButton.addEventListener('click', () => {
  const googleProvider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(googleProvider)
      .then((userCredential) => {
          const user = userCredential.user;
          console.log('User signed in:', user);
      })
      .catch((error) => {
          console.error('Error signing in:', error);
      });
});

firebase.auth().onAuthStateChanged((user) => {
  const uploadButton = document.getElementById("uploadButton");

  if (user) {
    // User is signed in
    googleSignInButton.style.display = 'none';
    if (user.uid === '5RigSrVVrsSWDQBYNLEmsQMb9cY2') {
      // User has the UID to upload images, show the button
      uploadButton.style.display = 'block';
      
      // Attach an event listener to handle image upload
      uploadButton.addEventListener("click", () => {
      const modal = document.getElementById("uploadModal");
      modal.style.display = "block";
    });
    } else {
      // User is signed in but does not have the UID, hide the button
      uploadButton.style.display = 'none';
    }
  } else {
    // User is not signed in, hide the button
    uploadButton.style.display = 'none';
  }
});

// Close the modal when the close button (X) is clicked
document.getElementById("closeModal").addEventListener("click", () => {
  const modal = document.getElementById("uploadModal");
  modal.style.display = "none";
});

// Close the modal when the user clicks outside of it
window.addEventListener("click", (event) => {
  const modal = document.getElementById("uploadModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
});

// Handle image upload within the modal
document.getElementById("uploadButtonModal").addEventListener("click", () => {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (file) {
    const storageRef = storage.ref().child(`images/${file.name}`);
    storageRef.put(file).then(() => {
      // Handle successful upload (e.g., refresh the gallery).
      refreshGallery();
      // Close the modal
      const modal = document.getElementById("uploadModal");
      modal.style.display = "none";
      window.location.reload();
    });
  }
  window.location.reload();
});

function refreshGallery() {
  const imageGallery = document.getElementById("imageGallery");
  // Clear the existing images.
  imageGallery.innerHTML = "";

  // Fetch the images from Firebase Storage and add them to the gallery.
  storage.ref().child("images").listAll().then((result) => {
    result.items.forEach((itemRef) => {
      itemRef.getDownloadURL().then((url) => {
        const img = document.createElement("img");
        img.src = url;
        imageGallery.appendChild(img);
      });
    });
  });
}

// Call the refreshGallery function to populate the initial gallery.
refreshGallery();
