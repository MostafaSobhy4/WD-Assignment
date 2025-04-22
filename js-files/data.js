
export class Task{

    taskId = undefined;
    taskTitle = undefined;
    teacherName = undefined;
    taskPriority = undefined;
    taskDescription = undefined;
    isCompleted = undefined;

    constructor(taskId,taskTitle, teacherName, taskPriority, taskDescription, isCompleted){
        this.taskId = taskId;
        this.taskTitle = taskTitle;
        this.teacherName = teacherName;
        this.taskPriority = taskPriority;
        this.taskDescription = taskDescription;
        this.isCompleted = isCompleted;
    }

}


class TaskList{

    tasksList = undefined;
    length = 0;

    constructor(){
        this.tasksList = [];
    }

    addTask(task){
        if(!this.taskExists(task)){
            this.tasksList.push(task);
            length++;
        } else {
            this.removeTask(task.taskId);
            this.tasksList.push(task);

            console.log('TaskId already exists.');
        }
        
    }

    taskExists(checkTask){
        let is = false;
        
        this.tasksList.forEach((task) => {

            if(task.taskId === checkTask.taskId){
                is = true;
            }
        })
        return is;
    }

    removeTask(taskId){
        this.tasksList.forEach((task, index) => {
            if(task.taskId === taskId){
                this.tasksList.splice(index, 1);
            }
        });
    }

    isEmpty(){
        return (this.length === 0);
    }


}


export class Account{
    accountName = undefined;
    accountPassword = undefined;
    accountEmail = undefined;
    accountRole = undefined;
    tasksList = undefined;
    isTeacher = undefined;

    constructor(accountName, accountPassword, accountEmail, accountRole){
        this.accountName = accountName;
        this.accountPassword = accountPassword;
        this.accountEmail = accountEmail;
        this.accountRole = accountRole;
        if(this.accountRole === 'teacher'){
            this.isTeacher = true;
            this.tasksList = new TaskList();
        } else {
            this.isTeacher = false;
        }
    }

    assignTaskList(tasksList){
        if(!this.isTeacher){
            console.log(`Can't assign tasks to this role.`);
            return;
        }
        delete this.tasksList;
        this.tasksList = tasksList;
    }

    addTask(task){
        if(!this.isTeacher){
            console.log(`Can't assign tasks to this role.`);
            return;
        }
        this.tasksList.addTask(task);

    }

}



class AccountsManager{
    accounts = undefined;

    constructor(){
        this.accounts = [];
    }

    accountExists(checkAccount){
        let is = false;
        this.accounts.forEach((account) => {
            if(account.accountName === checkAccount.accountName && account.accountPassword === checkAccount.accountPassword){
                is = true;

            }

        })
        return is;
    }


    addAccount(account){
        
        if(!this.accountExists(account)){
            this.accounts.push(account);
        }

    }

    
    getAccount(accountName, accountPassword){
        let matchingAccount = null;
        this.accounts.forEach((account) => {
           
            if(account.accountName === accountName && account.accountPassword === accountPassword){
                matchingAccount =  account;
            }
        });
        return matchingAccount;
    }

    removeAccount(accountName, accountPassword){
        this.accounts.forEach((account, index) => {
           
            if(account.accountName === accountName && account.accountPassword === accountPassword){
                this.accounts.splice(index, 1);
            }
        });

    }

    displayAccounts(){
        console.log(this.accounts);
    }

    saveToLocalStorage(){
        localStorage.setItem('accounts', JSON.stringify(this.accounts));
        console.log('Has been saved to local storage.');
    }

    loadFromLocalStorage() {
        let data = JSON.parse(localStorage.getItem('accounts'));
        if (!data) return;
    
        this.accounts = data.map(accountObj => {
            const account = new Account(
                accountObj.accountName,
                accountObj.accountPassword,
                accountObj.accountEmail,
                accountObj.accountRole
            );
    
            if (accountObj.isTeacher && accountObj.tasksList) {
                const taskList = new TaskList();
    
                accountObj.tasksList.tasksList.forEach(taskObj => {
                    const task = new Task(
                        taskObj.taskId,
                        taskObj.taskTitle,
                        taskObj.teacherName,
                        taskObj.taskPriority,
                        taskObj.taskDescription,
                        taskObj.isCompleted
                    );
                    taskList.tasksList.push(task);
                });
    
                account.assignTaskList(taskList);
            }
    
            return account;
        });
    
        console.log('loaded successfully.');
    }
    

    removeAllAccounts(){
        delete this.accounts;
        this.accounts = [];
    }

    getTaskbyId(taskId){
        let taskToReturn = null;
        this.accounts.forEach((account) => {

            if(account.accountRole === 'teacher'){
                let taskArray = account.tasksList.tasksList;

                taskArray.forEach((task) => {
                    if(task.taskId === taskId){
                        taskToReturn = task;
                    }
                })
            }
            
        })

        return taskToReturn;
    }

    getAllTeachers(){
        let arrayOfTeachers = [];
        accountsManager.accounts.forEach((account) => {
            if(account.accountRole === 'teacher'){
                arrayOfTeachers.push(account.accountName);
            }
        })
        return arrayOfTeachers;
    }

    removeTaskFromTeacher(taskId, teacherName){
        this.accounts.forEach((account) => {
            if(account.accountName === teacherName){
                account.tasksList.removeTask(taskId);
            }
        })
        this.saveToLocalStorage();
        
    }

    addTaskToTeacher(task, teacherName){
        this.accounts.forEach((account) => {
            if(account.accountName === teacherName){
                account.addTask(task);
            }
        })
        this.saveToLocalStorage();
    }

}

export let accountsManager = new AccountsManager();

export function logOut(){
    localStorage.setItem('logged-in','false');
}












 