import { accountsManager } from "./data.js";

let detailsTaskId = localStorage.getItem('detailsTaskId');

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


function generateDetailsHTML(detailsTaskId){
    let task;
   
    taskArray.forEach((taskToDisplay) => {
        if(taskToDisplay.taskId === detailsTaskId){
            task = taskToDisplay;
        }
    });


    let html = `
    <div class="date">
        <span class="start_date">
            <strong>Start Date: </strong> DD/MM/YYYY
        </span>
        <span class="end_date">
            <strong>End Date: </strong> DD/MM/YYYY
        </span>
    </div>
    <h1>${task.taskTitle}</h1>
    <div class="tags">
        <span class="priority priority-${task.taskPriority.toLowerCase()}">${task.taskPriority}</span>
        <span class="status status-${(task.isCompleted?'completed':'pending')}"
        >${(task.isCompleted?'Completed':'Pending')}</span>
    </div>
    <p>${task.taskDescription}</p>
    <a class="btn complete-tasks-btn complete-task-btn-js" href="../completed_tasks.html" data-task-id = "${task.taskId}">Complete This Task</a>
    `;

    document.querySelector('.task-details-container-js').innerHTML = html;

}

generateDetailsHTML(detailsTaskId);

let completeButton = document.querySelector('.complete-task-btn-js');
completeButton.addEventListener('click', () => {
    let taskId = completeButton.dataset.taskId;

    taskArray.forEach((task) => {
        if(taskId === task.taskId){
            task.isCompleted = true;
            accountsManager.saveToLocalStorage();
        }
    })

})

