/* ===============================
   SIMPLE ADMIN AUTH (JS ONLY)
=============================== */

// CHANGE THESE
const ADMIN_USER = "admin";
const ADMIN_PASS = "alhaarith123";

const form = document.getElementById("loginForm");
const error = document.getElementById("error");

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    localStorage.setItem("adminLoggedIn", "true");
    window.location.href = "admin.html";
  } else {
    error.innerText = "Invalid login details";
  }
});

/* ===============================
   PROTECT ADMIN PAGE
=============================== */
if (window.location.pathname.includes("admin.html")) {
  const loggedIn = localStorage.getItem("adminLoggedIn");
  if (!loggedIn) {
    window.location.href = "admin-login.html";
  }
}
