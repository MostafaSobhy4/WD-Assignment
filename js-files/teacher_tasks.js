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


function generateTeacherTasksHTML(priority){
    let html = '';

    taskArray.forEach((task) => {
        if(task.taskPriority.toLowerCase() === priority || priority === '' || priority ==='all'){
            html +=`
        <tr>
            <td>${task.taskId}</td>
            <td>${task.taskTitle}</td>
            <td>${task.teacherName}</td>
            <td><span class="priority priority-${task.taskPriority.toLowerCase()}">${task.taskPriority}</span></td>
            <td><span class="status status-${(task.isCompleted? 'completed' : 'pending')}">${(task.isCompleted? 'Completed' : 'Pending')}</span></td>
            <td>
                <a class="btn btn-details btn-details-js" data-task-id = "${task.taskId}" href="../details_task.html">Details</a>
            </td>
        </tr>
        `;
        }
        
    });


    let tasksContainer = document.querySelector('.teacher-tasks-container-js');
    tasksContainer.innerHTML = html;

}
generateTeacherTasksHTML('');


function getPriority(){
    return document.getElementById('priority-teacher').value;
}

let buttonSearch = document.querySelector('.btn-search-js');



buttonSearch.addEventListener('click', () => {

    let priority = getPriority();
    priority = (priority === "none"? '': priority);
    generateTeacherTasksHTML(priority);

});
let detailsTaskId;
let detailsButtons = document.querySelectorAll('.btn-details-js');
detailsButtons.forEach((button) => {
    let taskId = button.dataset.taskId;
    button.addEventListener('click',() => {
        detailsTaskId = taskId;
        localStorage.setItem('detailsTaskId',detailsTaskId);
    })
})