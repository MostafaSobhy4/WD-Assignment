from django.db import models

class Admin(models.Model):
    admin_id = models.AutoField(primary_key=True)
    userName = models.CharField(max_length=64)
    password = models.CharField(max_length=64)
    email = models.CharField(max_length=64)
    is_logged_in = models.BooleanField(default=False)  
    
class Teacher(models.Model):
    teacher_id = models.AutoField(primary_key=True)
    userName = models.CharField(max_length=64)
    password = models.CharField(max_length=64)
    email = models.CharField(max_length=64)
    is_logged_in = models.BooleanField(default=False) 

class Task(models.Model):
    task_id = models.AutoField(primary_key=True)

    PRIORITY_CHOICES = [
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ]

    taskTitle = models.CharField(max_length=64)
    taskDescription = models.TextField()
    teacher_id = models.ForeignKey('Teacher', on_delete=models.CASCADE, db_column='teacher_id')
    taskPriority = models.CharField(max_length=10, choices=PRIORITY_CHOICES)
    isCompleted = models.BooleanField()

