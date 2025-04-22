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

function generateCompletedTasksHTML(){

    let html = '';

    taskArray.forEach((task) => {
        if(task.isCompleted){
            html +=`
            <label class="task-box">
                <input checked class="check-input" disabled type="checkbox"/>
                <div class="task-details">
                    <span class="task-title">${task.taskTitle}</span>
                    <p class="task-desc">
                        <strong>Teacher:</strong> ${task.teacherName}<br>
                        <strong>Priority:</strong> ${task.taskPriority}<br>
                        <strong>Description:</strong> ${task.taskDescription}
                    </p>
                </div>
            </label>
            `
        };
        
    });

    let formContainer = document.querySelector('.form-container-js');
    formContainer.innerHTML = html;

}

generateCompletedTasksHTML();