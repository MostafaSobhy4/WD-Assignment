import { accountsManager } from "./data.js";
import {logOut} from "./data.js";


accountsManager.loadFromLocalStorage();

let state = localStorage.getItem("logged-in");

if(state !== 'true'){
    window.location.href = "../login.html";
}


const username = localStorage.getItem("username");
const password = localStorage.getItem("password");


let currentAccount = accountsManager.getAccount(username,password);

if(currentAccount.accountRole!='teacher'){
    window.location.href = "../login.html";
}

let tasksList = currentAccount.tasksList;
let taskArray = tasksList.tasksList;


function generateDashboardHTML(){

    let html = '';

    taskArray.forEach((task) => {
        if(task.isCompleted === false){
            html+=`
            <tr>
                <td>${task.taskId}</td>
                <td>
                    ${task.taskTitle}
                </td>
                <td>
                    <span class="priority priority-${task.taskPriority.toLowerCase()}">${task.taskPriority}</span>
                </td>
                <td>
                                <span class="status status-pending"
                                >Pending</span
                                >
                </td>
                <td>
                    <a class="btn btn-details btn-details-js" data-task-id = "${task.taskId}" href="../details_task.html">Details</a>
                </td>
                <td>
                    <input style="width: 20px; margin-left: 20px; height: 20px;" type="checkbox" class = "checkbox-js" data-task-id = "${task.taskId}"/>
                </td>
            </tr>
            `
        }
    })

    document.querySelector('.teacher-dashboard-js').innerHTML = html;
}

generateDashboardHTML();

let detailsTaskId;
let detailsButtons = document.querySelectorAll('.btn-details-js');
detailsButtons.forEach((button) => {
    let taskId = button.dataset.taskId;
    button.addEventListener('click',() => {
        detailsTaskId = taskId;
        localStorage.setItem('detailsTaskId',detailsTaskId);
    })
})

let completeTaskButton = document.querySelector('.complete-tasks-btn-js');
completeTaskButton.addEventListener('click', () => {

    let checkboxButtons = document.querySelectorAll('.checkbox-js');

    checkboxButtons.forEach((button) => {
        if(button.checked){
            let taskId = button.dataset.taskId;
            taskArray.forEach((task) => {
                if(task.taskId === taskId){
                    task.isCompleted = true;
                    accountsManager.saveToLocalStorage();
                }
            })

        }
    })


})

document.querySelector('.logout-js').addEventListener('click', () => {
    logOut();
    window.location.href = "../signup.html";
})
