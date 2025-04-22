import { accountsManager } from "./data.js";
import {Account} from "./data.js"
import {Task} from "./data.js"
 
let state = localStorage.getItem("logged-in");

if(state !== 'true'){
    window.location.href = "../login.html";
}

accountsManager.loadFromLocalStorage();


const username = localStorage.getItem("username");
const password = localStorage.getItem("password");

let taskToEdit = localStorage.getItem('taskToEdit');


let currentAccount = accountsManager.getAccount(username,password);

if(currentAccount.accountRole === 'teacher'){
    window.location.href = "../login.html";

}

let task = accountsManager.getTaskbyId(taskToEdit);

function taskTileHTML(){
    let html = `
     <label for="taskTitle">Task Title</label>
    <input type="text" id="taskTitle" class="form-control taskTitle-input-js" value= ${task.taskTitle} required></input>
    `;

    document.querySelector('.task-title-form-group-js').innerHTML = html;

}

function teacherNameHTML(){
    let html = '';

    let arrayOfTeachers = accountsManager.getAllTeachers();

    arrayOfTeachers.forEach((teacherName) => {
        html +=`
        <option >${teacherName}</option>`;
    });

    document.querySelector('.edit-task-select-teacher-js').innerHTML = html;
}


function taskAreaHTML(){
    document.querySelector('.textarea-js').innerHTML = task.taskDescription;
}

function generateEditTaskHTML(){
    taskTileHTML();
    teacherNameHTML();
    taskAreaHTML();

}



generateEditTaskHTML();


accountsManager.displayAccounts();


document.querySelector('.update-task-btn-js').addEventListener('click', () => {
    let taskId=  task.taskId;
    let teacherAccountName = document.querySelector('.edit-task-select-teacher-js').value;
    let taskTitle = document.querySelector('.taskTitle-input-js').value;
    let taskPriority = document.querySelector('.taskPriority-input-js').value;
    let taskDescription = document.querySelector('.textarea-js').value;
    let isCompleted = task.isCompleted;
    let updatedTask = new Task(taskId, taskTitle, teacherAccountName, taskPriority, taskDescription, isCompleted);
    let currentTeacherName = task.teacherName;
   
    accountsManager.removeTaskFromTeacher(taskId, currentTeacherName);
    accountsManager.addTaskToTeacher(updatedTask, teacherAccountName);

})



