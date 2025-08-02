from django.shortcuts import render, redirect
from .models import Admin, Teacher, Task
from django.views.decorators.cache import never_cache
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse


def home(request):
         
     logout_all_users()

     return render(request, 'taskManager/home.html') 

def login(request):
    logout_all_users()

    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password') 
        admins = Admin.objects.all()
        teachers = Teacher.objects.all()

        for admin in admins:
            if admin.userName == username and admin.password == password:
                admin.is_logged_in = True
                admin.save()
                return redirect('admin_dashboard', admin_id=admin.admin_id)

        for teacher in teachers:
            if teacher.userName == username and teacher.password == password:
                teacher.is_logged_in = True
                teacher.save()
                return redirect('teacher_dashboard', teacher_id=teacher.teacher_id)

        return render(request, 'taskManager/login.html', {
            'error': '❌ Invalid username or password.'
        })

    return render(request, 'taskManager/login.html')


def signup(request):
    logout_all_users()

    if(request.method == 'POST'):

        username = request.POST.get('username')
        password = request.POST.get('password')
        confirmpassword = request.POST.get('confirm_password')
        email = request.POST.get('email')
        role = request.POST.get('role')

        if(password == confirmpassword):
            if(role == 'admin'):
                newAdmin = Admin(userName=username, email=email, password=password)
                newAdmin.save()
                return redirect('signup')
            elif(role == 'teacher'):
                newTeacher = Teacher(userName=username, email=email, password=password)
                newTeacher.save()
                return redirect('signup')
            

    return render(request,'taskManager/signup.html')


@never_cache
@login_required
def teacherDashboard(request, teacher_id):

    try:
        teacher = Teacher.objects.get(pk=teacher_id)
    except Teacher.DoesNotExist:
        return redirect('login') 
    
    if not teacher.is_logged_in:
        return redirect('login') 
    
    tasks = getTasks(teacher_id)
    
    return render(request, 'taskManager/teacherDashboard.html', {'teacher': teacher, 'tasks': tasks})

def logout_view(request, user_type, user_id):

    if user_type == 'teacher':
        try:
            teacher = Teacher.objects.get(pk=user_id)
            teacher.is_logged_in = False
            teacher.save()
        except Teacher.DoesNotExist:
            pass
    elif user_type == 'admin':
        try:
            admin = Admin.objects.get(pk=user_id)
            admin.is_logged_in = False
            admin.save()
        except Admin.DoesNotExist:
            pass

    return redirect('login')

@never_cache
@login_required
def adminDashboard(request, admin_id):

    try:
        admin = Admin.objects.get(pk=admin_id)
    except Admin.DoesNotExist:
        return redirect('login') 
    
    if not admin.is_logged_in:
        return redirect('login') 
    
    tasks = Task.objects.select_related('teacher_id').all()

    return render(request,'taskManager/adminDashboard.html',{'admin':admin,'tasks': tasks})

@never_cache
@login_required
def addTask(request, admin_id):
    try:
        admin = Admin.objects.get(pk=admin_id)
    except Admin.DoesNotExist:
        return redirect('login')

    if not admin.is_logged_in:
        return redirect('login')

    if request.method == 'POST':
        title = request.POST.get('taskTitle')
        description = request.POST.get('description')
        teacher_id = request.POST.get('teacherName')
        priority = request.POST.get('priority')

        if teacher_id == 'all':
            teachers = Teacher.objects.all()
            for teacher in teachers:
                Task.objects.create(
                    taskTitle=title,
                    taskDescription=description,
                    teacher_id=teacher,
                    taskPriority=priority,
                    isCompleted=False
                )
        else:
            teacher = Teacher.objects.filter(pk=teacher_id).first()
            if teacher:
                Task.objects.create(
                    taskTitle=title,
                    taskDescription=description,
                    teacher_id=teacher,
                    taskPriority=priority,
                    isCompleted=False
                )
        return redirect('admin_dashboard', admin_id=admin_id)

    teachers = Teacher.objects.all()
    return render(request, 'taskManager/add_task.html', {'admin': admin, 'teachers': teachers})

@never_cache
@login_required
def completed_tasks(request, teacher_id):

    try:
        teacher = Teacher.objects.get(pk=teacher_id)
    except Teacher.DoesNotExist:
        return redirect('login') 
    
    if not teacher.is_logged_in:
        return redirect('login') 

    tasks = Task.objects.filter(teacher_id=teacher_id, isCompleted=True)
    return render(request, 'taskManager/completed_tasks.html', {
        'completed_tasks': tasks,
        'teacher': Teacher.objects.get(pk=teacher_id),
    })
    
@never_cache
@login_required
def taskDetails(request,teacher_id, task_id):
    
    try:
        teacher = Teacher.objects.get(pk=teacher_id)
    except Teacher.DoesNotExist:
        return redirect('login') 
    
    if not teacher.is_logged_in:
        return redirect('login') 
    
    task = Task.objects.filter(task_id=task_id, teacher_id=teacher_id).first()
     
    return render(request, 'taskManager/details_task.html', {'task':task, 'teacher_id':teacher_id})



@never_cache
@login_required
def assignedTasks(request, teacher_id):

    try:
        teacher = Teacher.objects.get(pk=teacher_id)
    except Teacher.DoesNotExist:
        return redirect('login') 
    
    if not teacher.is_logged_in:
        return redirect('login') 
    
    tasks = getTasks(teacher_id)
    
    return render(request, 'taskManager/assigned_tasks.html', {'tasks' : tasks,'teacher': teacher})

@never_cache
@login_required
def teacherTasks(request, teacher_id):

    try:
        teacher = Teacher.objects.get(pk=teacher_id)
    except Teacher.DoesNotExist:
        return redirect('login') 
    
    if not teacher.is_logged_in:
        return redirect('login') 
    
    priority = request.GET.get('priority')
    tasks = Task.objects.filter(teacher_id=teacher_id)

    if priority and priority != "all":
        tasks = tasks.filter(taskPriority__iexact=priority)

    return render(request, 'taskManager/teacher_tasks.html', {
        'tasks': tasks,
        'teacher': Teacher.objects.get(pk=teacher_id),
    })

def logout_all_users():
    Teacher.objects.filter(is_logged_in=True).update(is_logged_in=False)
    Admin.objects.filter(is_logged_in=True).update(is_logged_in=False)


def getTasks(teacher_id):
        tasks = Task.objects.filter(teacher_id=teacher_id)
        return tasks

@never_cache
@login_required
def toggleTaskCompletion(request, teacher_id, task_id):
    if request.method == 'POST':

        task = Task.objects.filter(task_id=task_id, teacher_id=teacher_id).first()
        is_completed = 'isCompleted' in request.POST
        task.isCompleted = is_completed
        task.save()

    return redirect('teacher_dashboard', teacher_id=teacher_id)

def deleteTask(request, task_id, admin_id):
    if not Admin.objects.filter(is_logged_in=True).exists():
        return redirect('login')
    try:
        task = Task.objects.get(pk=task_id)
        task.delete()
    except Task.DoesNotExist:
        pass
    return redirect('admin_dashboard', admin_id=admin_id)

@never_cache
@login_required
def editTask(request, admin_id, task_id):
    try:
        admin = Admin.objects.get(pk=admin_id)
    except Admin.DoesNotExist:
        return redirect('signup')

    if not admin.is_logged_in:
        return redirect('login')

    task = Task.objects.get(pk=task_id)

    if request.method == 'POST':
        title = request.POST.get('taskTitle')
        description = request.POST.get('description')
        teacher_id = request.POST.get('teacherName')
        priority = request.POST.get('priority')
        is_completed = request.POST.get('isCompleted') == 'on'

        if teacher_id == 'all':
            task.delete()

            teachers = Teacher.objects.all()
            for teacher in teachers:
                Task.objects.create(
                    taskTitle=title,
                    taskDescription=description,
                    teacher_id=teacher,
                    taskPriority=priority,
                    isCompleted=is_completed
                )
        else:
            teacher = Teacher.objects.get(pk=teacher_id)

            task.taskTitle = title
            task.taskDescription = description
            task.teacher_id = teacher
            task.taskPriority = priority
            task.isCompleted = is_completed
            task.save()

        return redirect('admin_dashboard', admin_id=admin_id)

    teachers = Teacher.objects.all()
    context = {
        'task': task,
        'teachers': teachers,
        'admin': admin,
    }
    return render(request, 'taskManager/edit_task.html', context)


