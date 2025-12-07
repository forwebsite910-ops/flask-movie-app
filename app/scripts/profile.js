// ===============================
// PROTECT PAGE (only logged users)
// ===============================
const activeUserString = localStorage.getItem("activeUser");

if (!activeUserString) {
  alert("You must login first.");
  window.location.href = "index.html";
}

let activeUser;

// Handle both old string format and new JSON format
try {
  activeUser = JSON.parse(activeUserString);
} catch (e) {
  // Old format detected - it's just a string (username)
  alert("Please login again with the updated system.");
  localStorage.removeItem("activeUser");
  window.location.href = "index.html";
}

// ===============================
// LOAD USER DATA
// ===============================
document.getElementById("profileName").value = activeUser.name || "";
document.getElementById("profileEmail").value = activeUser.email || "";
document.getElementById("profilePassword").value = activeUser.password || "";

// ===============================
// SAVE CHANGES
// ===============================
document.getElementById("saveProfile").addEventListener("click", () => {
  const updatedName = document.getElementById("profileName").value;
  const updatedPassword = document.getElementById("profilePassword").value;

  // Update active user
  activeUser.name = updatedName;
  activeUser.password = updatedPassword;

  // Save to LocalStorage
  localStorage.setItem("activeUser", JSON.stringify(activeUser));

  alert("Profile updated successfully!");
});

// ===============================
// LOGOUT
// ===============================
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("activeUser");
  alert("You have been logged out successfully!");
  window.location.href = "index.html";
});