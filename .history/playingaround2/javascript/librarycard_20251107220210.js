// Firebase imports
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } 
  from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// Config (fixed storageBucket!)
const firebaseConfig = {
  apiKey: "AIzaSyD6oc8zduJhBmagzjZJyQyiDiQ2mQJqol0",
  authDomain: "toddytalks-11c29.firebaseapp.com",
  projectId: "toddytalks-11c29",
  storageBucket: "toddytalks-11c29.appspot.com",
  messagingSenderId: "98877864943",
  appId: "1:98877864943:web:63f2fac0aea8ef7589541a",
  measurementId: "G-1BTHNXCPPQ"
};

// Initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);






let currentRow = null;

document.addEventListener('DOMContentLoaded', () => {

  // Handle row clicks to open main popup
  document.querySelectorAll('.clickable-row').forEach(row => {
    row.addEventListener('click', () => {
      currentRow = row;
      document.getElementById('popup').style.display = 'block';
      updatePopupWord();

      // Load existing data if available
      document.getElementById('popup-word-input').value = currentRow.cells[1].textContent || '';

      if (currentRow.dataset.rating) {
        document.getElementById('rating-display').innerHTML = getStarRatingHTML(parseInt(currentRow.dataset.rating));
      } else {
        document.getElementById('rating-display').textContent = '';
      }
      const tallyVal = parseInt(currentRow.dataset.tally);
      document.getElementById('tally-display').innerHTML = !isNaN(tallyVal) ? getTallyHTML(tallyVal) : '';
    });
  });

  // Load saved words from Firestore
  (async () => {
    const querySnapshot = await getDocs(collection(db, "words"));
    const tbody = document.querySelector('.notepad-table tbody');

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const row = document.createElement("tr");
      row.classList.add("clickable-row");

      row.dataset.rating = data.rating;
      row.dataset.tally = data.tally;
      row.dataset.comment = data.comment;

      row.innerHTML = `
        <td></td>
        <td>${data.word || ""}</td>
        <td>${data.date || ""}</td>
        <td>${data.tally ? getTallyHTML(data.tally) : ""}</td>
        <td>${data.rating ? getStarRatingHTML(data.rating) : ""}</td>
      `;

      tbody.appendChild(row);
    });

    recalculateScores();
  })();


  // Word label/input event handlers (only once)
  const wordLabel = document.getElementById('popup-word-label');
  const wordInput = document.getElementById('popup-word-input');
  wordLabel.addEventListener('click', () => {
    wordInput.value = wordLabel.textContent === 'WORD' ? '' : wordLabel.textContent;
    wordLabel.style.display = 'none';
    wordInput.style.display = 'block';
    wordInput.focus();
  });
  wordInput.addEventListener('blur', () => {
    if (!currentRow) return;

    let newWord = wordInput.value.trim().toUpperCase();
    if (newWord === '') newWord = 'WORD';

    wordLabel.textContent = newWord;
    wordLabel.style.display = 'inline-block';
    wordInput.style.display = 'none';

    currentRow.cells[1].textContent = newWord === 'WORD' ? '' : newWord;
  });

  // Avatar click/upload event handlers (only once)
  const avatarImage = document.getElementById('avatar-image');
  const avatarUpload = document.getElementById('avatar-upload');

  if (avatarImage && avatarUpload) {
    avatarImage.addEventListener('click', () => {
      avatarUpload.click();
    });

    avatarUpload.addEventListener('change', () => {
      const file = avatarUpload.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          avatarImage.src = e.target.result;
          // Save avatar to currentRow dataset if needed
          if (currentRow) {
            currentRow.dataset.avatar = e.target.result;
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  function updatePopupWord() {
    if (!currentRow) return;
    const word = currentRow.cells[1].textContent.trim();
    wordLabel.textContent = word === '' ? 'WORD' : word.toUpperCase();
    wordLabel.style.display = 'inline-block';
    wordInput.style.display = 'none';
  }

  // Add event listeners for popup buttons
  document.getElementById('comment-btn')?.addEventListener('click', () => openMiniPopup('comment'));
  document.getElementById('rating-btn')?.addEventListener('click', () => openMiniPopup('rating'));
  document.getElementById('tally-btn')?.addEventListener('click', () => openMiniPopup('tally'));
  document.getElementById('save-btn')?.addEventListener('click', () => saveWord());
});


// Mini popup form submission
document.getElementById('mini-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const input = document.getElementById('mini-input').value.trim();
  const type = this.dataset.type;

  if (!input || !currentRow) return;

  if (type === 'comment') {
    currentRow.dataset.comment = input;
    document.getElementById('comment-text-display').textContent = input;

  } else if (type === 'rating') {
    const ratingNum = Math.min(Math.max(parseInt(input), 1), 10); // clamp 1 to 10
    currentRow.dataset.rating = ratingNum;
    document.getElementById('rating-display').innerHTML = getStarRatingHTML(ratingNum);
    currentRow.cells[4].innerHTML = getStarRatingHTML(ratingNum);
  } else if (type === 'tally') {
    const tallyNum = parseInt(input);
    currentRow.dataset.tally = tallyNum;

    // Show tally in popup
    document.getElementById('tally-display').innerHTML = getTallyHTML(tallyNum);

    // Update the tally cell in the table
    currentRow.cells[3].innerHTML = getTallyHTML(tallyNum);
  }

  document.getElementById('mini-input').value = '';
  closeMiniPopup();
  recalculateScores(); // Update score ranks
});


function openMiniPopup(type) {
  const popup = document.getElementById('mini-popup');
  const titleMap = {
    comment: 'Add Comment',
    rating: 'Add Rating',
    tally: 'Add Tally',
  };

  document.getElementById('mini-title').textContent = titleMap[type];
  document.getElementById('mini-input').placeholder = `Enter ${type}...`;
  document.getElementById('mini-form').dataset.type = type;
  if (type === 'comment') {
    document.getElementById('mini-input').value = currentRow?.dataset.comment || '';
  } else {
    document.getElementById('mini-input').value = '';
  }

  popup.style.display = 'block';
}


function closeMiniPopup() {
  document.getElementById('mini-popup').style.display = 'none';
}

function closePopup() {
  document.getElementById('popup').style.display = 'none';
}

function recalculateScores() {
  const tbody = document.querySelector('.notepad-table tbody');
  const rows = Array.from(document.querySelectorAll('.clickable-row'));

  // Filter only rows with valid rating and tally to score
  const scoredRows = rows.filter(row => {
    const rating = parseFloat(row.dataset.rating);
    const tally = parseInt(row.dataset.tally);
    return !isNaN(rating) && !isNaN(tally);
  });

  // Calculate score and store in dataset
  scoredRows.forEach(row => {
    const rating = parseFloat(row.dataset.rating);
    const tally = parseInt(row.dataset.tally);
    const score = (rating * 10) + (tally * 2);
    row.dataset.score = score;
  });

  // Sort scored rows descending by score
  scoredRows.sort((a, b) => b.dataset.score - a.dataset.score);

  // Assign ranks starting at 1 and update score column
  scoredRows.forEach((row, index) => {
    row.cells[0].textContent = index + 1; // Score (rank) column
  });

  // Unscored rows: clear rank and keep at the bottom
  const unscoredRows = rows.filter(row => !scoredRows.includes(row));
  unscoredRows.forEach(row => {
    row.cells[0].textContent = '';
  });

  // Clear tbody and append rows: scored rows first (sorted), then unscored rows
  tbody.innerHTML = ''; // Clear existing rows

  scoredRows.forEach(row => tbody.appendChild(row)); // Append high scores first
  unscoredRows.forEach(row => tbody.appendChild(row)); // Append rest at bottom
}

function getStarRatingHTML(rating, max = 10) {
  let stars = '';
  for (let i = 1; i <= max; i++) {
    if (i <= rating) {
      stars += '<span class="star-rating">&#9733;</span>'; // filled star
    } else {
      stars += '<span class="star-rating empty">&#9733;</span>'; // empty star (gray)
    }
  }
  return stars;
}

function getTallyHTML(tally) {
  let html = '';
  let fullGroups = Math.floor(tally / 5);
  let remainder = tally % 5;

  // Handle all full groups of 5
  for (let i = 0; i < fullGroups; i++) {
    html += `<span class="tally-group">
      <span class="tally-bar"></span>
      <span class="tally-bar"></span>
      <span class="tally-bar"></span>
      <span class="tally-bar"></span>
      <span class="tally-bar diagonal"></span>
    </span>`;
  }

  // Handle remainder (1 to 4)
  if (remainder > 0) {
    html += `<span class="tally-group">`;
    for (let i = 0; i < remainder; i++) {
      html += `<span class="tally-bar"></span>`;
    }
    html += `</span>`;
  }

  return html;
}

async function saveWord() {
  if (!currentRow) return;

  const wordInput = document.getElementById('popup-word-input');
  const wordLabel = document.getElementById('popup-word-label');
  let newWord = wordInput.value.trim().toUpperCase();
  if (newWord === '') newWord = 'WORD';

  // Update UI
  wordLabel.textContent = newWord;
  wordLabel.style.display = 'inline-block';
  wordInput.style.display = 'none';
  currentRow.cells[1].textContent = newWord === 'WORD' ? '' : newWord;

  // Add today's date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB').slice(0, 8).replace(/\//g, '-');
  currentRow.cells[2].textContent = formattedDate;

  // Save to Firestore
  await addDoc(collection(db, "words"), {
    word: newWord,
    date: formattedDate,
    rating: currentRow.dataset.rating || null,
    tally: currentRow.dataset.tally || null,
    comment: currentRow.dataset.comment || null
  });

  console.log("✅ Word saved to Firestore:", newWord);
  closePopup();
}

// Open login popup when clicking username
document.getElementById("user-name").addEventListener("click", () => {
  document.getElementById("login-popup").style.display = "block";
});

// Open signup popup from login popup
document.getElementById("open-signup-btn").addEventListener("click", () => {
  document.getElementById("login-popup").style.display = "none";
  document.getElementById("signup-popup").style.display = "block";
});

// Cancel buttons
document.getElementById("cancel-login-btn").addEventListener("click", () => {
  document.getElementById("login-popup").style.display = "none";
});
document.getElementById("cancel-signup-btn").addEventListener("click", () => {
  document.getElementById("signup-popup").style.display = "none";
});

// Login function
async function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    document.getElementById("login-popup").style.display = "none";
  } catch (err) {
    alert("Login failed: " + err.message);
  }
}
document.getElementById("login-btn").addEventListener("click", login);

// Signup function
async function signup() {
  console.log("Sign up clicked");
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  if (!name) {
    alert("Please enter your name!");
    return;
  }

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    
    // Correct way to update displayName
    await updateProfile(userCred.user, { displayName: name });

    document.getElementById("signup-popup").style.display = "none";
  } catch (err) {
    alert("Signup failed: " + err.message);
  }
}
document.getElementById("signup-btn").addEventListener("click", signup);

// Update UI when user logs in/out
onAuthStateChanged(auth, (user) => {
  if (user) {
    const displayName = user.displayName || (user.email ? user.email.split("@")[0] : "User");
    document.getElementById("user-name").textContent = displayName;
  } else {
    document.getElementById("user-name").textContent = "Guest";
  }
});




// Expose functions to global scope
window.openMiniPopup = openMiniPopup;
window.closeMiniPopup = closeMiniPopup;
window.closePopup = closePopup;
window.saveWord = saveWord;
window.signup = signup;
window.login = login;
