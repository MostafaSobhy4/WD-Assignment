import { accountsManager } from "./data.js";
import {Account} from "./data.js";
import { Task } from "./data.js";

let state = localStorage.getItem("logged-in");



if(state !== 'true'){
    window.location.href = "../login.html";
}

accountsManager.loadFromLocalStorage();

const username = localStorage.getItem("username");
const password = localStorage.getItem("password");

let currentAccount = accountsManager.getAccount(username,password);

if(currentAccount.accountRole === 'teacher'){
    window.location.href = "../login.html";

}

function teacherNameHTML(){
    let html = '';

    let arrayOfTeachers = accountsManager.getAllTeachers();

    arrayOfTeachers.forEach((teacherName) => {
        html +=`
        <option >${teacherName}</option>`;
    });

    document.querySelector('.teacher-name-input-js').innerHTML = html;
}


accountsManager.displayAccounts();
teacherNameHTML();

    document.querySelector('.create-task-btn-js').addEventListener('click', () => {
    let taskTitle = document.querySelector('.task-title-input-js').value;
    let teacherAccountName = document.querySelector('.teacher-name-input-js').value;
    let taskPriority = document.querySelector('.priority-input-js').value;
    let taskDescription = document.querySelector('.textarea-input-js').value;

    if(localStorage.getItem('IdCount') === null){
        localStorage.setItem('IdCount', '1');
    }
    let taskId = localStorage.getItem('IdCount');
    let newTask = new Task(taskId,taskTitle, teacherAccountName, taskPriority, taskDescription, false );
    taskId ++;
    localStorage.setItem('IdCount', taskId);
    accountsManager.addTaskToTeacher(newTask, teacherAccountName);
    window.location.href = "../admin_dashboard.html";


})

