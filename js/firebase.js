
// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: "librarianv1.firebaseapp.com",
  projectId: "librarianv1",
  storageBucket: "librarianv1.firebasestorage.app",
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APPID,
  measurementId: "G-GX9VJZ0QQ1"
};


// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore(app);

// Initialize Firebase Authentication
const auth = firebase.auth(app);

// Function to sign in with Google
function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then((result) => {
        const user = result.user;
        // Handle user information
        console.log("User signed in: ", user);
    }).catch((error) => {
        console.error("Error signing in: ", error);
    });
}

// Function to sign out
function signOut() {
    auth.signOut().then(() => {
        console.log("User signed out.");
    }).catch((error) => {
        console.error("Error signing out: ", error);
    });
}

// Function to add a book to Firestore
function addBook(bookData) {
    return db.collection("books").add(bookData).then((docRef) => {
        console.log("Book added with ID: ", docRef.id);
    }).catch((error) => {
        console.error("Error adding book: ", error);
    });
}

// Function to get books from Firestore
function getBooks() {
    return db.collection("books").get().then((querySnapshot) => {
        const books = [];
        querySnapshot.forEach((doc) => {
            books.push({ id: doc.id, ...doc.data() });
        });
        return books;
    }).catch((error) => {
        console.error("Error getting books: ", error);
    });
}