import { accountsManager } from "./data.js";
accountsManager.loadFromLocalStorage();
localStorage.setItem('logged-in','false');

const togglePassword = document.getElementById("toggle-password");
const passwordInput = document.getElementById("log-password");

togglePassword.addEventListener("click", () => {
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;
  togglePassword.classList.toggle("fa-eye");
  togglePassword.classList.toggle("fa-eye-slash");
});

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", function (e) {
e.preventDefault();

const enteredUsername = document.getElementById("log-username").value;
const enteredPassword = document.getElementById("log-password").value;

const message = document.getElementById("pass-msg");

let currentAccount = accountsManager.getAccount(enteredUsername,enteredPassword);



if (
    (currentAccount)
) {
    alert(`Welcome back, ${enteredUsername}!`);
    localStorage.setItem('logged-in','true');
    localStorage.setItem('username', enteredUsername);
    localStorage.setItem('password', enteredPassword);


    if (currentAccount.accountRole === "admin") {
        window.location.href = "../admin_dashboard.html";
    } 
    else if (currentAccount.accountRole === "teacher") {
        window.location.href = "../teacher_dashboard.html";
    }
}
else {
    message.textContent = "Invalid username, password";
}
});