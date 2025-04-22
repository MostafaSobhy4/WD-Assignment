import { accountsManager } from "./data.js";
import {Account} from "./data.js"

localStorage.setItem('logged-in','false');


        accountsManager.loadFromLocalStorage();
        

        const togglePassword = document.getElementById("toggle-password");
        const passwordInput = document.getElementById("signup-pass");
    
        togglePassword.addEventListener("click", () => {
            const type = passwordInput.type === "password" ? "text" : "password";
            passwordInput.type = type;
            togglePassword.classList.toggle("fa-eye");
            togglePassword.classList.toggle("fa-eye-slash");
        });
    
        const toggleConfirm = document.getElementById("toggle-confirm-password");
        const confirmInput = document.getElementById("confirm-pass");
    
        toggleConfirm.addEventListener("click", () => {
            const type = confirmInput.type === "password" ? "text" : "password";
            confirmInput.type = type;
            toggleConfirm.classList.toggle("fa-eye");
            toggleConfirm.classList.toggle("fa-eye-slash");
        });

        function validatePassword(password) {
        const minLength = 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isLongEnough = password.length >= minLength;

        if (!isLongEnough || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar)
         return "❌ Password must be at least 12 characters, Must include the folowing (an uppercase and lowercase letter, include a number and include a special character).";
        return "✅ Password is strong.";
        }
    
        const form = document.getElementById("signup-form");
        const message = document.getElementById("pass-msg");
    
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (passwordInput.value !== confirmInput.value) {
                message.textContent = "❌ Passwords do not match!";
            } 
            else {
                const result = validatePassword(passwordInput.value);
                if (result !== "✅ Password is strong.") {
                    message.textContent = result;
                    const signup = document.getElementsByClassName("signup-page")[0].style.height = "800px";
                    signup.style.height = "800px";
                }
                else {
                    message.textContent = "";
                    alert("✅ Signed up successfully!");

                    const username = document.getElementById("username").value;
                    const password = passwordInput.value;
                    const role = document.getElementById("role").value;
                    let newAccount = new Account(username, password, '', role);
                    accountsManager.addAccount(newAccount);
                    accountsManager.saveToLocalStorage();
                    localStorage.setItem('logged-in', 'true');
                    localStorage.setItem('username', username);
                    localStorage.setItem('password', password);


                    if (role === "admin") {
                        window.location.href = "../admin_dashboard.html";
                    } 
                    else if (role === "teacher") {
                        window.location.href = "../teacher_dashboard.html";
                    }
                                        

                    
                }
            }

        });


