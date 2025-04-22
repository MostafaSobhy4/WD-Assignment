import { accountsManager } from "./data.js";
import {Account} from "./data.js"

let state = localStorage.getItem("logged-in");

if(state === 'true'){
    accountsManager.loadFromLocalStorage();


const username = localStorage.getItem("username");
const password = localStorage.getItem("password");

let currentAccount = accountsManager.getAccount(username,password);
    if(currentAccount.accountRole === 'teacher'){
        window.location.href = "../teacher_dashboard.html";

    } else if (currentAccount.accountRole === 'admin'){
        window.location.href = "../admin-dashboard.html";

    }
}





