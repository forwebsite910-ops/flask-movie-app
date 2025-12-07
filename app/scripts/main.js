/* ---------------------------------------------------------
   DROPDOWN MENUS
--------------------------------------------------------- */
let loggedInUser = null; // will store user's name after login

const dropdownButtons = document.querySelectorAll(".filter-btn");
const dropdownMenus = document.querySelectorAll(".dropdown");

// Toggle dropdown on button click
dropdownButtons.forEach((btn, index) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeAllDropdowns(index);
    dropdownMenus[index].style.display =
      dropdownMenus[index].style.display === "block" ? "none" : "block";
  });
});

// Close other dropdowns
function closeAllDropdowns(exceptIndex) {
  dropdownMenus.forEach((menu, i) => {
    if (i !== exceptIndex) menu.style.display = "none";
  });
}

// Close dropdowns when clicking outside
document.addEventListener("click", () => {
  dropdownMenus.forEach((menu) => (menu.style.display = "none"));
});

/* ---------------------------------------------------------
   PROFILE BUTTON TOGGLE
--------------------------------------------------------- */

function updateHeaderForLogin() {
  document.getElementById("profileBtn").classList.remove("hidden");
  document.getElementById("openLogin").classList.add("hidden");
  document.getElementById("openSignup").classList.add("hidden");
}

function updateHeaderForLogout() {
  document.getElementById("profileBtn").classList.add("hidden");
  document.getElementById("openLogin").classList.remove("hidden");
  document.getElementById("openSignup").classList.remove("hidden");
  loggedInUser = null;
}

// If user already logged in (refresh page)
const activeUserData = localStorage.getItem("activeUser");
if (activeUserData) {
  try {
    const activeUser = JSON.parse(activeUserData);
    loggedInUser = activeUser.name;
    updateHeaderForLogin();
    enableCommenting();
  } catch (e) {
    // Old format, clear it
    localStorage.removeItem("activeUser");
  }
}

/* ---------------------------------------------------------
   LOGIN MODAL
--------------------------------------------------------- */

const loginModal = document.getElementById("loginModal");
const openLogin = document.getElementById("openLogin");
const closeLogin = document.getElementById("closeLogin");

openLogin.addEventListener("click", () => {
  loginModal.classList.remove("hidden");
});

closeLogin.addEventListener("click", () => {
  loginModal.classList.add("hidden");
});

// Close when clicking outside modal
loginModal.addEventListener("click", (e) => {
  if (e.target === loginModal) loginModal.classList.add("hidden");
});

// LOGIN SUBMIT
document.querySelector("#loginModal .btn-primary").addEventListener("click", () => {
  const email = document.querySelector("#loginModal input[type='email']").value;
  const password = document.querySelector("#loginModal input[type='password']").value;
  
  // Create user object
  const user = {
    name: email.split("@")[0],
    email: email,
    password: password
  };
  
  loggedInUser = user.name;
  
  // Save as JSON object
  localStorage.setItem("activeUser", JSON.stringify(user));

  alert("Logged in as: " + loggedInUser);

  // Update header UI
  updateHeaderForLogin();

  loginModal.classList.add("hidden");
  enableCommenting();
});

/* ---------------------------------------------------------
   SIGNUP MODAL
--------------------------------------------------------- */

const signupModal = document.getElementById("signupModal");
const openSignup = document.getElementById("openSignup");
const closeSignup = document.getElementById("closeSignup");

openSignup.addEventListener("click", () => {
  signupModal.classList.remove("hidden");
});

closeSignup.addEventListener("click", () => {
  signupModal.classList.add("hidden");
});

// Close when clicking outside modal
signupModal.addEventListener("click", (e) => {
  if (e.target === signupModal) signupModal.classList.add("hidden");
});

// SIGNUP SUBMIT
document.querySelector("#signupModal .btn-primary").addEventListener("click", () => {
  const name = document.querySelector("#signupModal input[type='text']").value;
  const email = document.querySelector("#signupModal input[type='email']").value;
  const password = document.querySelector("#signupModal input[type='password']").value;

  const user = {
    name: name,
    email: email,
    password: password
  };

  loggedInUser = user.name;
  
  localStorage.setItem("activeUser", JSON.stringify(user));

  alert("Account created for: " + loggedInUser);

  updateHeaderForLogin();

  signupModal.classList.add("hidden");
  enableCommenting();
});

/* ---------------------------------------------------------
   OPTIONAL: FILTER SELECTION LOGIC (You can use for Project)
--------------------------------------------------------- */

// Example: when selecting a dropdown item
dropdownMenus.forEach((menu) => {
  const options = menu.querySelectorAll("p");

  options.forEach((option) => {
    option.addEventListener("click", () => {
      alert("Selected: " + option.textContent);
      menu.style.display = "none";
    });
  });
});

/* ----------------------------------------------
   SEARCH FUNCTION
------------------------------------------------ */

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const movieCards = document.querySelectorAll(".movie-card");

searchBtn.addEventListener("click", searchMovies);
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") searchMovies();
});

function searchMovies() {
  const value = searchInput.value.toLowerCase();

  movieCards.forEach(card => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    const description = card.querySelector(".release-date").textContent.toLowerCase();
    const rating = card.querySelector(".rating").textContent.toLowerCase();

    if (
      title.includes(value) ||
      description.includes(value) ||
      rating.includes(value)
    ) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

/* --------------------------------------------------------------
   COMMENT SYSTEM (ONLY LOGGED IN USERS CAN COMMENT)
---------------------------------------------------------------- */

function enableCommenting() {
  const msg = document.querySelectorAll(".login-required-msg");
  const textareas = document.querySelectorAll(".comment-input");
  const postBtns = document.querySelectorAll(".submit-comment");

  // Show textarea and button
  msg.forEach(m => m.classList.add("hidden"));
  textareas.forEach(t => t.classList.remove("hidden"));
  postBtns.forEach(b => b.classList.remove("hidden"));
}

// Submit comment for each movie
document.querySelectorAll(".submit-comment").forEach((btn, index) => {
  btn.addEventListener("click", () => {
    if (!loggedInUser) {
      alert("You must login to comment.");
      return;
    }

    const textarea = document.querySelectorAll(".comment-input")[index];
    const commentBox = document.querySelectorAll(".comments")[index];

    const comment = textarea.value.trim();
    if (comment === "") return alert("Write something!");

    const p = document.createElement("p");
    p.innerHTML = `<strong>${loggedInUser}:</strong> ${comment}`;

    commentBox.appendChild(p);
    textarea.value = "";
  });
});