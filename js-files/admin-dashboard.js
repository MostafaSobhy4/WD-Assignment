import { accountsManager } from "./data.js";
import {Account} from "./data.js"

export let taskToEdit;

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

    if (username) {
        const welcomeMessage = document.getElementById("welcome-message");
        welcomeMessage.textContent = `Welcome, ${username}!`;
    } 
    else {
        window.location.href = "../login.html";
    };



    function generateAdminDashboardHTML(){
        let arrayOfAccounts = accountsManager.accounts;
        let html = '';

        arrayOfAccounts.forEach((account) => {

            if(account.accountRole === 'teacher'){
                let arrayOfTasks = account.tasksList.tasksList;

                arrayOfTasks.forEach((task) => {

                    html += 
                    `
                    <tr>
                        <td>${task.taskId}</td>
                        <td>${task.taskTitle}</td>
                        <td>${task.teacherName}</td>
                        <td><span class="priority priority-${task.taskPriority.toLowerCase()}">${task.taskPriority}</span></td>
                        <td><span class="status status-${task.isCompleted?'completed':'pending'}">${task.isCompleted?'Completed':'Pending'}</span></td>
                        <td>
                            <a class="btn btn-edit btn-edit-js" data-task-id="${task.taskId}">Edit</a>
                            <button class="btn btn-delete btn-delete-js" data-task-id ="${task.taskId}" data-teacher-name = "${task.teacherName}">Delete</button>
                              </td>
                       </tr>
                      `


                })
            }



        })

        document.querySelector('.admin-tasks-container-js').innerHTML = html;



        document.querySelectorAll('.btn-edit-js').forEach((button) => {
            button.addEventListener('click', () => {
                taskToEdit = button.dataset.taskId;
                localStorage.setItem('taskToEdit', taskToEdit);
                window.location.href = "../EditTask.html";
            })
        })

        deleteButtons();
    
        


        
    }

    generateAdminDashboardHTML();

    

    


    function deleteButtons(){
        document.querySelectorAll('.btn-delete-js').forEach((button) => {
            button.addEventListener('click',() => {
                let taskId = button.dataset.taskId;
                let teacherName = button.dataset.teacherName;
                accountsManager.removeTaskFromTeacher(taskId, teacherName);
                generateAdminDashboardHTML();
            })
        })
    }

