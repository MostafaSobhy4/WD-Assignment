from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('login/', views.login, name='login'),
    path('signup/', views.signup, name='signup'),
    path('logout/<str:user_type>/<int:user_id>/', views.logout_view, name='logout'),
    path('teacherdashboard/<int:teacher_id>/', views.teacherDashboard, name='teacher_dashboard'),
    path('admindashboard/<int:admin_id>/', views.adminDashboard, name='admin_dashboard'),
    path('addtask/<int:admin_id>/', views.addTask, name='add_task'),
    path('completedtasks/<int:teacher_id>/', views.completed_tasks, name='completed_tasks'),
    path('taskdetails/<int:teacher_id>/task/<int:task_id>/', views.taskDetails, name='task_details'),
    path('assignedtasks/<int:teacher_id>/', views.assignedTasks, name='assigned_tasks'),
    path('teachertasks/<int:teacher_id>/', views.teacherTasks, name='teacher_tasks'),
    path('toggle_task_completion/<int:teacher_id>/<int:task_id>/',views.toggleTaskCompletion, name = 'toggle_task_completion'),
    path('delete_task<int:task_id>/<int:admin_id>/', views.deleteTask, name = 'delete_task'),
    path('edittask/<int:admin_id>/<int:task_id>/', views.editTask, name='edit_task'),
]
