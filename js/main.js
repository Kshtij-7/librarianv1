// This file contains the JavaScript code for the main homepage, handling user authentication and group management functionalities.

document.addEventListener('DOMContentLoaded', function() {
    const googleSignInButton = document.getElementById('google-sign-in');
    const createGroupButton = document.getElementById('create-group');
    const joinGroupButton = document.getElementById('join-group');

    document.getElementById('gotoGroup').addEventListener('click', () => {
        window.location.href = "group.html"
    })

    function showUserGroups(userId) {
    const groupsList = document.getElementById('groups-list');
    groupsList.innerHTML = '<li>Loading...</li>';
    db.collection("groups")
      .where("members", "array-contains", userId)
      .get()
      .then((querySnapshot) => {
          groupsList.innerHTML = '';
          if (querySnapshot.empty) {
              groupsList.innerHTML = '<li>You are not in any groups yet.</li>';
          } else {
              querySnapshot.forEach((doc) => {
                  const group = doc.data();
                  const li = document.createElement('li');
                  li.textContent = group.name + " (ID: " + doc.id + ")";
                  groupsList.appendChild(li);
              });
          }
      })
      .catch((error) => {
          groupsList.innerHTML = '<li>Error loading groups.</li>';
          console.error('Error fetching groups:', error);
      });
    }
    

    function showProfileInfo(user) {
        const authSection = document.getElementById('auth-section');
        authSection.innerHTML = `
        <h2>Welcome, ${user.displayName || user.email}</h2>
        <img src="${user.photoURL || 'https://via.placeholder.com/100'}" alt="Profile Picture" style="width:100px;height:100px;border-radius:50%;">
        <p>Email: ${user.email}</p>
        <button id="sign-out">Sign Out</button>
    `;

        document.getElementById('sign-out').addEventListener('click', function () {
            firebase.auth().signOut().then(() => {
                location.reload();
            });
        });
        showUserGroups(user.uid);
    }

    googleSignInButton.addEventListener('click', function() {
        // Call Firebase authentication to sign in with Google
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then((result) => {
            // User signed in successfully
            const user = result.user;
            console.log('User signed in:', user);
            showProfileInfo(user);
        }).catch((error) => {
            console.error('Error during sign in:', error);
        });
    });

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

    /* const emailSignInButton = document.getElementById('email-signin');
    const emailInput = document.getElementById('email');

    emailSignInButton.addEventListener('click', function() {
        const email = emailInput.value.trim();
        if (!email) {
            alert('Please enter your email.');
            return;
        }
        const password = prompt('Enter your password:');
        if (!password) {
            alert('Password is required.');
            return;
        }

        // Try to sign in, if user does not exist, create account
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((result) => {
                // User signed in successfully
                const user = result.user;
                console.log('User signed in with email:', user);
                // Redirect to group page or show group options
            })
            .catch((error) => {
                if (error.code === 400) {
                    // If user not found, create a new account
                    firebase.auth().createUserWithEmailAndPassword(email, password)
                        .then((result) => {
                            const user = result.user;
                            console.log('User account created:', user);
                            // Redirect to group page or show group options
                        })
                        .catch((err) => {
                            alert('Error creating account: ' + err.message);
                        });
                } else {
                    alert('Error signing in: ' + error.message);
                    console.log(error.code);
                }
            });
    }); */

    createGroupButton.addEventListener('click', function() {
        const groupName = prompt("Enter the name of the new group:");
        if (groupName) {
            // Logic to create a new group in Firebase
            const userId = firebase.auth().currentUser.uid;
            db.collection("groups").add({
                name: groupName,
                owner: userId,
                members: [userId]
            }).then(() => {
                alert('Group created successfully!');
                // Redirect to the group page
            }).catch((error) => {
                console.error('Error creating group:', error);
            });
        }
    });

    joinGroupButton.addEventListener('click', function() {
        const groupId = prompt("Enter the group ID to join:");
        if (groupId) {
            // Logic to join an existing group in Firestore
            const userId = firebase.auth().currentUser.uid;
            db.collection("groups").doc(groupId).get().then((doc) => {
                if (doc.exists) {
                    const groupData = doc.data();
                    const members = groupData.members || [];
                    if (!members.includes(userId)) {
                        members.push(userId);
                        db.collection("groups").doc(groupId).update({ members: members }).then(() => {
                            alert('Joined group successfully!');
                            // Redirect to the group page
                        });
                    } else {
                        alert('You are already a member of this group.');
                    }
                } else {
                    alert('Group not found.');
                }
            }).catch((error) => {
                console.error('Error joining group:', error);
            });
        }
    });
});