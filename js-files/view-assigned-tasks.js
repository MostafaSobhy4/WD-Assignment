import { accountsManager } from "./data.js";


accountsManager.loadFromLocalStorage();

let state = localStorage.getItem("logged-in");

if(state !== 'true'){
    window.location.href = "../login.html";
}


const username = localStorage.getItem("username");
const password = localStorage.getItem("password");

let currentAccount = accountsManager.getAccount(username,password);

if(currentAccount.accountRole!=='teacher'){
    window.location.href = "../login.html";
}

let tasksList = currentAccount.tasksList;
let taskArray = tasksList.tasksList;



function generateViewAssignedTasksHTML(){
    let html = '';

    taskArray.forEach((task) => {

        html+=`
        <tr>
            <td>${task.taskId}</td>
            <td>${task.taskTitle}</td>
            <td><span class="priority priority-${task.taskPriority.toLowerCase()}">${task.taskPriority}</span></td>
            <td><span class="status status-${(task.isCompleted? 'completed' : 'pending')}">${(task.isCompleted? 'Completed' : 'Pending')}</span></td>
            <td>
                <a class="btn btn-details btn-details-js" data-task-id = "${task.taskId}" href="../details_task.html">Details</a>
            </td>
        </tr>
        `


    });

    document.querySelector('.view-assigned-tasks-js').innerHTML = html;

    
}

generateViewAssignedTasksHTML();


let detailsTaskId;
let detailsButtons = document.querySelectorAll('.btn-details-js');
detailsButtons.forEach((button) => {
    let taskId = button.dataset.taskId;
    button.addEventListener('click',() => {
        detailsTaskId = taskId;
        localStorage.setItem('detailsTaskId',detailsTaskId);
    })
})
