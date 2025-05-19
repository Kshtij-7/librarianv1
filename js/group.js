// filepath: /book-sharing-app/book-sharing-app/public/js/group.js

document.addEventListener('DOMContentLoaded', function() {
    const groupSelect = document.getElementById('group-select');
    const bookList = document.getElementById('book-list');
    const notificationsButton = document.getElementById('notifications-button');
    const groupNameDisplay = document.getElementById('group-name');


    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const userRef = firebase.firestore().collection('users').doc(user.uid);
            userRef.set({
                displayName: user.displayName || null,
                email: user.email || null,
                id: user.uid,
            }, { merge: true });
        }
    });

    function getInviteGroupId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('invite');
    }

    document.getElementById('copyID').addEventListener('click', function() {
        const groupId = groupSelect.value;
        navigator.clipboard.writeText(groupId).then(() => {
            this.innerText = "Copied group ID!";
            this.style.background = "green";
            setTimeout(() => {
                this.innerText = "Copy group ID";
                this.style.background = "#35424a";
            }, 2000);
        });
    });

    document.getElementById('shareButton').addEventListener('click', function () {
        const groupId = groupSelect.value;
        const groupName = groupSelect.options[groupSelect.selectedIndex].text;
        const shareText = `Join my book sharing group "${groupName}" using this ID: ${groupId}`;
        navigator.share({
            title: "Book Sharing Group",
            text: shareText,
            url: window.location.href + "?invite=" + groupId,
        })
            .then(() => console.log('Successful share'))
            .catch(error => console.log('Error sharing:', error));
    });

    document.getElementById('group-info-button').addEventListener('click', function () {
        const selectedGroupId = groupSelect.value;
        if (!selectedGroupId) {
            alert("Please select a group first.");
            return;
        }

        document.getElementById('group-info-name').hidden = false;
        document.getElementById('group-info-total').hidden = false;

        document.getElementById('group-info-title').hidden = false;
        document.getElementById('group-name-title').hidden = false;
        document.getElementById('group-id-title').hidden = false;
        document.getElementById('copyID').hidden = false;
        document.getElementById('shareButton').hidden = false;
        document.getElementById('group-total-title').hidden = false;

        document.getElementById('group-info-id').innerText = selectedGroupId;

        // Fetch group info from Firestore
        firebase.firestore().collection('groups').doc(selectedGroupId).get()
            .then(doc => {
                if (doc.exists) {
                    const groupData = doc.data();
                    const members = groupData.members || [];
                    const groupName = groupData.name || selectedGroupId;
                    const ownerId = groupData.owner || null;
                    

                    // Populate group name and total members
                    document.getElementById('group-info-name').textContent = groupName;
                    document.getElementById('group-info-total').textContent = members.length;

                    // Fetch member details (display name or email)
                    const membersList = document.getElementById('group-members');
                    membersList.innerHTML = ""; // Clear previous members
                    let count = 0;

                    members.forEach(memberId => {
                        firebase.firestore().collection('users').doc(memberId).get()
                            .then(userDoc => {
                                if (userDoc.exists) {
                                    const userData = userDoc.data();
                                   
                                    const li = document.createElement('li');
                                    li.innerHTML =`<button>`+ (userData.displayName || userData.email || "Unknown User") + (userData.id === ownerId ? " (Owner)" : "") + `</button> <br><br>`;
                                    li.addEventListener('click', () => {
                                        loadUserProfile(userData.id);
                                    })
                                    membersList.appendChild(li);
                                    count++;

                                    // Make the list scrollable if more than 5 members
                                    if (count > 5) {
                                        document.getElementById('group-members-list').style.overflowY = "auto";
                                    } else {
                                        document.getElementById('group-members-list').style.overflowY = "hidden";
                                    }
                                }
                            });
                    });

                    // Show the popup
                    document.getElementById('group-info-popup').classList.add('show');
                    //popup.classList.add('show');
                    
                    document.getElementById('group-info-popup').style.display = 'block';
                } else {
                    alert("Group not found.");
                }
            })
            .catch(error => {
                console.error("Error fetching group info:", error);
                alert("Failed to fetch group info.");
            });
    });

    // Close the popup
    document.getElementById('close-group-info').addEventListener('click', function () {
        document.getElementById('group-info-popup').style.display = 'none';
    });

    document.getElementById('members-list-button').addEventListener('click', function () {
        const selectedGroupId = groupSelect.value;
        if (!selectedGroupId) {
            alert("Please select a group first.");
            return;
        }

        document.getElementById('group-info-id').innerText = selectedGroupId;

        

        // Fetch group info from Firestore
        firebase.firestore().collection('groups').doc(selectedGroupId).get()
            .then(doc => {
                if (doc.exists) {
                    const groupData = doc.data();
                    const members = groupData.members || [];
                    //const groupName = groupData.name || selectedGroupId;
                    const ownerId = groupData.owner || null;
                    

                    // Populate group name and total members
                    document.getElementById('group-info-name').hidden = true;
                    document.getElementById('group-info-total').hidden = true;
                    
                    document.getElementById('group-info-title').hidden = true;
                    document.getElementById('group-name-title').hidden = true;
                    document.getElementById('group-id-title').hidden = true;
                    document.getElementById('copyID').hidden = true;
                    document.getElementById('shareButton').hidden = true;
                    document.getElementById('group-total-title').hidden = true;

                    // Fetch member details (display name or email)
                    const membersList = document.getElementById('group-members');
                    membersList.innerHTML = ""; // Clear previous members
                    let count = 0;

                    members.forEach(memberId => {
                        firebase.firestore().collection('users').doc(memberId).get()
                            .then(userDoc => {
                                if (userDoc.exists) {
                                    const userData = userDoc.data();
                                   
                                    const li = document.createElement('li');
                                    li.innerHTML =`<button>`+ (userData.displayName || userData.email || "Unknown User") + (userData.id === ownerId ? " (Owner)" : "") + `</button> <br><br>`;
                                    li.addEventListener('click', () => {
                                        loadUserProfile(userData.id);
                                    })
                                    membersList.appendChild(li);
                                    count++;

                                    // Make the list scrollable if more than 5 members
                                    if (count > 5) {
                                        document.getElementById('group-members-list').style.overflowY = "auto";
                                    } else {
                                        document.getElementById('group-members-list').style.overflowY = "hidden";
                                    }
                                }
                            });
                    });

                    // Show the popup
                    document.getElementById('group-info-popup').classList.add('show');
                    //popup.classList.add('show');
                    
                    document.getElementById('group-info-popup').style.display = 'block';
                } else {
                    alert("Group not found.");
                }
            })
            .catch(error => {
                console.error("Error fetching group info:", error);
                alert("Failed to fetch group info.");
            });
    });

    function loadActiveRequests() {
        const user = firebase.auth().currentUser;
        const requestsUl = document.getElementById('requests-list');
        if (!user) return;
        requestsUl.innerHTML = "<li>Loading...</li>";

        firebase.firestore().collection('requests')
            .where('requesterId', '==', user.uid)
            .where('status', '==', 'pending')
            .orderBy('createdAt', 'desc')
            .get()
            .then(snapshot => {
                requestsUl.innerHTML = "";
                if (snapshot.empty) {
                    requestsUl.innerHTML = "<li>No active requests.</li>";
                } else {
                    snapshot.forEach(doc => {
                        const req = doc.data();
                        const li = document.createElement('li');
                        li.innerHTML = `
                        <strong>Book ID:</strong> ${req.bookId}<br>
                        <strong>To:</strong> ${req.ownerName}<br>
                        <strong>Status:</strong> ${req.status}
                    `;
                        requestsUl.appendChild(li);
                    });
                }
            })
            .catch(error => {
                requestsUl.innerHTML = "<li>Error loading requests.</li>";
                console.error(error);
            });
    }

    function loadMyBooks() {
        const user = firebase.auth().currentUser;
        const selectedGroup = groupSelect.value;
        const myBooksUl = document.getElementById('my-books-list');
        const searchValue = document.getElementById('my-books-search').value.trim().toLowerCase();
        myBooksUl.innerHTML = "<li>Loading...</li>";

        firebase.firestore().collection('books')
            .where('groupId', '==', selectedGroup)
            .where('ownerId', '==', user.uid)
            .orderBy('createdAt', 'desc')
            .get()
            .then(querySnapshot => {
                myBooksUl.innerHTML = "";
                let count = 0;
                querySnapshot.forEach(doc => {
                    const book = doc.data();
                    // Search filter
                    if (
                        !searchValue ||
                        book.title.toLowerCase().includes(searchValue) ||
                        book.author.toLowerCase().includes(searchValue) ||
                        book.summary.toLowerCase().includes(searchValue)
                    ) {
                        const li = document.createElement('li');
                        li.innerHTML = `
                        <img src="${book.imageUrl}" alt="${book.title}" style="width:40px;height:60px;object-fit:cover;margin-right:10px;vertical-align:middle;">
                        <strong>${book.title}</strong> by ${book.author}<br>
                        <em>${book.summary}</em><br>
                        Status: <span id="status-${doc.id}">${book.status}</span>
                        <button onclick="editBookPrompt('${doc.id}', '${book.title.replace(/'/g,"\\'")}', '${book.author.replace(/'/g,"\\'")}', '${book.summary.replace(/'/g,"\\'")}', '${book.imageUrl.replace(/'/g,"\\'")}', '${book.status.replace(/'/g,"\\'")}')">Edit</button>
                        <button onclick="deleteBook('${doc.id}')">Delete</button>
                    `;
                        myBooksUl.appendChild(li);
                        count++;
                    }
                });
                // Scrollable if more than 2
                if (count > 2) {
                    myBooksUl.classList.add('scrollable');
                } else {
                    myBooksUl.classList.remove('scrollable');
                }
                if (count === 0) {
                    myBooksUl.innerHTML = "<li>No books found.</li>";
                }
            })
            .catch(error => {
                myBooksUl.innerHTML = "<li>Error loading your books.</li>";
                console.error(error);
            });
    }

    // Wait for Firebase Auth to be ready
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            const inviteGroupId = getInviteGroupId();
            if (inviteGroupId) {
                // Check if user is already a member
                firebase.firestore().collection("groups").doc(inviteGroupId).get().then(doc => {
                    if (doc.exists) {
                        const groupData = doc.data();
                        if (groupData.members && groupData.members.includes(user.uid)) {
                            alert("You are already a member of this group.");
                        } else {
                            if (confirm(`Do you want to join the group "${groupData.name || inviteGroupId}"?`)) {
                                firebase.firestore().collection("groups").doc(inviteGroupId).update({
                                    members: firebase.firestore.FieldValue.arrayUnion(user.uid)
                                }).then(() => {
                                    alert("You have joined the group!");
                                    // Optionally, reload or update group list
                                    localStorage.setItem('lastSelectedGroupId', inviteGroupId);
                                    window.location.search = ""; // Remove invite param and reload
                                });
                            }
                        }
                    } else {
                        alert("This group does not exist.");
                    }
                });
            }
            // Fetch groups where the user is a member
            firebase.firestore().collection("groups")
                .where("members", "array-contains", user.uid)
                .get()
                .then((querySnapshot) => {
                    groupSelect.innerHTML = ""; // Clear previous options
                    let found = false;
                    const lastSelectedGroupId = localStorage.getItem('lastSelectedGroupId');
                    if (querySnapshot.empty) {
                        const option = document.createElement('option');
                        option.text = "No groups found";
                        option.value = "";
                        groupSelect.appendChild(option);
                    } else {
                        querySnapshot.forEach((doc) => {
                            const option = document.createElement('option');
                            option.value = doc.id;
                            option.text = doc.data().name || doc.id;
                            if (lastSelectedGroupId && doc.id === lastSelectedGroupId) {
                                option.selected = true;
                                found = true;
                            }
                            groupSelect.appendChild(option);
                        });
                        // If lastSelectedGroupId was found, trigger change, else default to first group
                        if (found) {
                            groupSelect.dispatchEvent(new Event('change'));
                        } else {
                            // If not found, select the first group and save it
                            groupSelect.selectedIndex = 0;
                            localStorage.setItem('lastSelectedGroupId', groupSelect.value);
                            groupSelect.dispatchEvent(new Event('change'));
                        }
                    }
                });
        } else {
            // Not signed in, redirect to login or show message
            window.location.href = "index.html";
        }
    });

    // Handle group selection change
    groupSelect.addEventListener('change', function() {
        const selectedOption = groupSelect.options[groupSelect.selectedIndex];
        if (selectedOption && selectedOption.value) {
            localStorage.setItem('lastSelectedGroupId', selectedOption.value);
            
            groupNameDisplay.style.display = "inline";
            groupNameDisplay.textContent = selectedOption.text;
            loadBooks();
            loadActiveRequests();
            loadMyBooks();
        } else {
            groupNameDisplay.style.display = "none";
            groupNameDisplay.textContent = "";
        }
    });

    // Event listener for notifications
    notificationsButton.addEventListener('click', function() {
        loadNotifications();
    });

    document.getElementById('notifications-button').addEventListener('click', function() {
        document.getElementById('notifications').hidden = !document.getElementById('notifications').hidden;
    });

    document.getElementById('my-books-button').addEventListener('click', function() {
        document.getElementById('my-books').hidden = !document.getElementById('my-books').hidden;
    });

    document.getElementById('add-book-button').addEventListener('click', function() {
        document.getElementById('add-book').hidden = !document.getElementById('add-book').hidden;
    });

    document.getElementById('leaveGroup').addEventListener('click', function() {
        const user = firebase.auth().currentUser;
        const groupId = groupSelect.value;
        if (!user || !groupId) return;
        if (confirm("Are you sure you want to leave this group?")) {
            firebase.firestore().collection("groups").doc(groupId).update({
                members: firebase.firestore.FieldValue.arrayRemove(user.uid)
            }).then(() => {
                alert("You have left the group.");
                // Optionally, reload or update group list
                groupSelect.value = ""; // Clear selection
                groupNameDisplay.style.display = "none";
                groupNameDisplay.textContent = "";
                loadBooks();
            });
        }
    });

    document.getElementById('clear-notifications-button').addEventListener('click', function () {
        const user = firebase.auth().currentUser;
        if (!user) return;
        firebase.firestore().collection('notifications')
            .where('userId', '==', user.uid)
            .get()
            .then(snapshot => {
                const batch = firebase.firestore().batch();
                snapshot.forEach(doc => {
                    batch.delete(doc.ref);
                });
                return batch.commit();
            })
            .then(() => {
                alert("Notifications cleared!");
                loadNotifications();
            })
            .catch(error => {
                alert("Error clearing notifications: " + error.message);
            });
    });

    /* function loadGroups() {
        // Fetch groups from Firebase and populate the group select dropdown
        // Example: firebase.firestore().collection('groups').get().then(...)
    } */

    function loadBooks() {
        const selectedGroup = groupSelect.value;
        const booksUl = document.getElementById('books');
        const searchValue = document.getElementById('books-search').value.trim().toLowerCase();
        booksUl.innerHTML = "<li>Loading...</li>";
        const user = firebase.auth().currentUser;

        firebase.firestore().collection('books')
            .where('groupId', '==', selectedGroup)
            .orderBy('createdAt', 'desc')
            .get()
            .then(querySnapshot => {
                booksUl.innerHTML = "";
                let count = 0;
                querySnapshot.forEach(doc => {
                    const book = doc.data();
                    // Search filter
                    if (
                        !searchValue ||
                        book.title.toLowerCase().includes(searchValue) ||
                        book.author.toLowerCase().includes(searchValue) ||
                        book.summary.toLowerCase().includes(searchValue)
                    ) {
                        const li = document.createElement('li');
                        li.innerHTML = `
                        <img src="${book.imageUrl}" alt="${book.title}" style="width:50px;height:75px;object-fit:cover;margin-right:10px;vertical-align:middle;">
                        <strong>${book.title}</strong> by ${book.author} <br>
                        <em>${book.summary}</em><br>
                        Owner: ${book.ownerName} | Status: ${book.status}
                        ${book.ownerId !== user.uid && book.status === "available" ? `<button id="${doc.id}" onclick="requestBook('${doc.id}', '${book.ownerId}', '${book.title.replace(/'/g,"\\'")}', '${book.ownerName.replace(/'/g,"\\'")}')">Request</button>` : ""}
                    `;
                        booksUl.appendChild(li);
                        count++;
                    }
                });
                // Scrollable if more than 5
                if (count > 5) {
                    booksUl.classList.add('scrollable');
                } else {
                    booksUl.classList.remove('scrollable');
                }
                if (count === 0) {
                    booksUl.innerHTML = "<li>No books found.</li>";
                }
            })
            .catch(error => {
                booksUl.innerHTML = "<li>Error loading books.</li>";
                console.error(error);
            });
    }

    function loadNotifications() {
        const user = firebase.auth().currentUser;
        const notificationsDiv = document.getElementById('notifications');
        notificationsDiv.innerHTML = "<p>Loading...</p>";

        firebase.firestore().collection('requests')
            .where('ownerId', '==', user.uid)
            .where('status', '==', 'pending')
            .get()
            .then(snapshot => {
                if (snapshot.empty) {
                    notificationsDiv.innerHTML = "<p>No new requests.</p>";
                } else {
                    notificationsDiv.innerHTML = "";
                    snapshot.forEach(doc => {
                        const req = doc.data();
                        console.log(req);
                        const div = document.createElement('div');
                        div.innerHTML = `
                        <strong>${req.requesterName}</strong> requested your book "${req.bookTitle}".<br>
                        <button onclick="acceptRequest('${doc.id}')">Accept</button>
                        <button onclick="declineRequest('${doc.id}')">Decline</button>
                        <hr>
                    `;
                        notificationsDiv.appendChild(div);
                    });
                }
            });

        firebase.firestore().collection('notifications')
            .where('userId', '==', user.uid)
            .orderBy('createdAt', 'desc')
            .get()
            .then(snapshot => {
                if (snapshot.empty) {
                    notificationsDiv.innerHTML += "<p>No notifications.</p>";
                } else {
                    notificationsDiv.innerHTML = "";
                    snapshot.forEach(doc => {
                        const notif = doc.data();
                        const div = document.createElement('div');
                        div.innerHTML = `
                        <span>${notif.message}</span>
                        <hr>
                    `;
                        notificationsDiv.appendChild(div);
                    });
                }
            });
    }

    /* function requestBook(bookId) {
        // Function to request a book
        // Example: firebase.firestore().collection('requests').add({...})
    } */

    document.getElementById('bookSubmitButton').addEventListener('click', function(event) {
        event.preventDefault();
        addBook();
    }
    );

    function addBook() {
        const title = document.getElementById('book-title').value.trim();
        const author = document.getElementById('book-author').value.trim();
        const summary = document.getElementById('book-summary').value.trim();
        const imageUrl = document.getElementById('book-image-url').value.trim();
        const groupId = groupSelect.value;
        const user = firebase.auth().currentUser;

        if (!title || !author || !summary || !imageUrl || !groupId) {
            alert("Please fill all fields and select a group.");
            return;
        }

        firebase.firestore().collection('books').add({
            title,
            author,
            summary,
            imageUrl,
            groupId,
            ownerId: user.uid,
            ownerName: user.displayName || user.email,
            status: "available",
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            alert("Book added!");
            //bookForm.reset();
            loadBooks();
            loadMyBooks();
        }).catch(error => {
            alert("Error adding book: " + error.message);
        });
    }


    window.editBookPrompt = function (bookId, title, author, summary, imageUrl, status) {
        const newTitle = prompt("Edit Title:", title);
        if (newTitle === null) return;
        const newAuthor = prompt("Edit Author:", author);
        if (newAuthor === null) return;
        const newSummary = prompt("Edit Summary:", summary);
        if (newSummary === null) return;
        const newImageUrl = prompt("Edit Image URL:", imageUrl);
        if (newImageUrl === null) return;
        const newStatus = prompt("Edit Status (available/borrowed/reading):", status);
        if (newStatus === null) return;

        firebase.firestore().collection('books').doc(bookId).update({
            title: newTitle,
            author: newAuthor,
            summary: newSummary,
            imageUrl: newImageUrl,
            status: newStatus
        }).then(() => {
            alert("Book updated!");
            loadBooks();
            loadMyBooks();
        }).catch(error => {
            alert("Error updating book: " + error.message);
        });
    };

    window.deleteBook = function (bookId) {
        if (!confirm("Are you sure you want to delete this book?")) return;
        firebase.firestore().collection('books').doc(bookId).delete()
            .then(() => {
                alert("Book deleted!");
                loadBooks();
                loadMyBooks();
            }).catch(error => {
                alert("Error deleting book: " + error.message);
            });
    };

    window.requestBook = function (bookId, ownerId, bookTitle, ownerName) {
        const user = firebase.auth().currentUser;
        if (!user) {
            alert("You must be signed in to request a book.");
            return;
        }
        // Prevent duplicate requests
        firebase.firestore().collection('requests')
            .where('bookId', '==', bookId)
            .where('requesterId', '==', user.uid)
            .where('status', '==', 'pending')
            .get()
            .then(snapshot => {
                if (!snapshot.empty) {
                    alert("You have already requested this book.");
                    return;
                }
                // Add request
                firebase.firestore().collection('requests').add({
                    bookId,
                    bookTitle,
                    ownerId,
                    ownerName,
                    requesterId: user.uid,
                    requesterName: user.displayName || user.email,
                    status: 'pending',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                }).then(() => {
                    //alert("Request sent!");
                    document.getElementById(bookId).innerText = "Requested!";
                    document.getElementById(bookId).style.background = "green";
                    loadActiveRequests();
                });
            });
    };

    window.acceptRequest = function (requestId) {
        const requestsRef = firebase.firestore().collection('requests').doc(requestId);
        requestsRef.get().then(doc => {
            if (!doc.exists) return;
            const req = doc.data();
            console.log(req);
            // Update request status
            requestsRef.update({ status: 'accepted' }).then(() => {
                // Add notification for requester
                firebase.firestore().collection('notifications').add({
                    userId: req.requesterId,
                    message: `Your request for the book (${req.bookTitle}) has been accepted by ${req.ownerName}.`,
                    status: 'unread',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                alert("Request accepted!");
                loadNotifications();
            });
            var title = req.bookTitle;
            //var author = req.author;
            
            
            var status = `borrowed by ${req.requesterName}`;

            firebase.firestore().collection('books').doc(req.bookId).update({
                title: title,
                
                status: status
            }).catch(error => {
                alert("Error updating book: " + error.message);
            });
        });

    };

    window.declineRequest = function (requestId) {
        const requestsRef = firebase.firestore().collection('requests').doc(requestId);
        requestsRef.get().then(doc => {
            if (!doc.exists) return;
            const req = doc.data();
            console.log(req);
            // Update request status
            requestsRef.update({ status: 'declined' }).then(() => {
                // Add notification for requester
                firebase.firestore().collection('notifications').add({
                    userId: req.requesterId,
                    message: `Your request for the book (${req.bookTitle}) has been declined by ${req.ownerName}.`,
                    status: 'unread',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                alert("Request declined.");
                loadNotifications();
            });
        });
    };

    // Add event listeners for search
    document.getElementById('my-books-search').addEventListener('input', loadMyBooks);
    document.getElementById('books-search').addEventListener('input', loadBooks);

    // Additional functions for handling book details and requests can be added here
});



function loadUserProfile(userId) {
    const selectedGroup = localStorage.getItem('lastSelectedGroupId');

    // Elements to display profile data
    const profileName = document.getElementById('profile-name');
    const listedBooksUl = document.getElementById('profile-listed-books');
    const borrowedBooksUl = document.getElementById('profile-borrowed-books');

    document.getElementById('user-profile').classList.add('show');
    document.getElementById('close-profile-info').addEventListener('click',  () =>{
        document.getElementById('user-profile').classList.remove('show');
    });

    // Clear previous data
    profileName.textContent = "Loading...";
    listedBooksUl.innerHTML = "<li>Loading...</li>";
    borrowedBooksUl.innerHTML = "<li>Loading...</li>";

    // Fetch user details
    firebase.firestore().collection('users').doc(userId).get()
        .then(userDoc => {
            if (userDoc.exists) {
                const userData = userDoc.data();
                profileName.textContent = userData.displayName || userData.email || "Unknown User";

                // Fetch listed books in the group
                firebase.firestore().collection('books')
                    .where('groupId', '==', selectedGroup)
                    .where('ownerId', '==', userId)
                    .get()
                    .then(querySnapshot => {
                        listedBooksUl.innerHTML = "";
                        if (querySnapshot.empty) {
                            listedBooksUl.innerHTML = "<li>No listed books.</li>";
                        } else {
                            querySnapshot.forEach(doc => {
                                const book = doc.data();
                                const li = document.createElement('li');
                                li.textContent = `${book.title} by ${book.author}`;
                                listedBooksUl.appendChild(li);
                            });
                        }
                    });

                // Fetch borrowed books in the group
                firebase.firestore().collection('books')
                    .where('groupId', '==', selectedGroup)
                    .where('status', '==', `borrowed by ${userData.displayName || userData.email}`)
                    .get()
                    .then(querySnapshot => {
                        borrowedBooksUl.innerHTML = "";
                        if (querySnapshot.empty) {
                            borrowedBooksUl.innerHTML = "<li>No borrowed books.</li>";
                        } else {
                            querySnapshot.forEach(doc => {
                                const book = doc.data();
                                const li = document.createElement('li');
                                li.textContent = `${book.title} by ${book.author}`;
                                borrowedBooksUl.appendChild(li);
                            });
                        }
                    });
            } else {
                profileName.textContent = "User not found.";
                listedBooksUl.innerHTML = "<li>No data available.</li>";
                borrowedBooksUl.innerHTML = "<li>No data available.</li>";
            }
        })
        .catch(error => {
            console.error("Error loading user profile:", error);
            profileName.textContent = "Error loading profile.";
            listedBooksUl.innerHTML = "<li>Error loading data.</li>";
            borrowedBooksUl.innerHTML = "<li>Error loading data.</li>";
        });

    
}