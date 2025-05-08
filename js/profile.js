// filepath: /book-sharing-app/book-sharing-app/public/js/profile.js

document.addEventListener('DOMContentLoaded', function() {
    const userProfile = document.getElementById('user-profile');
    const userBooksList = document.getElementById('user-books-list');

    // Function to fetch user data from Firebase
    function fetchUserData(userId) {
        // Assuming a function getUserData exists in firebase.js
        getUserData(userId).then(userData => {
            displayUserProfile(userData);
            displayUserBooks(userData.books);
        }).catch(error => {
            console.error("Error fetching user data:", error);
        });
    }

    // Function to display user profile information
    function displayUserProfile(userData) {
        userProfile.innerHTML = `
            <h2>${userData.name}</h2>
            <p>Email: ${userData.email}</p>
        `;
    }

    // Function to display the list of books added by the user
    function displayUserBooks(books) {
        userBooksList.innerHTML = '';
        books.forEach(book => {
            const bookItem = document.createElement('li');
            bookItem.textContent = `${book.title} by ${book.author}`;
            userBooksList.appendChild(bookItem);
        });
    }

    // Get the current user's ID (assuming a function getCurrentUserId exists)
    const currentUserId = getCurrentUserId();
    fetchUserData(currentUserId);
});