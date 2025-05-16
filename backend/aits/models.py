from django.db import models
from django.contrib.auth.models import AbstractUser #this line imports the abstract user function in django

# Create your models here.
class CustomUser(AbstractUser):
    is_admin = models.BooleanField(default=False)
    is_lecturer = models.BooleanField(default=False)
    is_registra = models.BooleanField(default=False)
    is_student = models.BooleanField(default=False)

    def __str__(self):
        return self.username

    Roles = (
        ('admin','Admin'),
        ('lecturer','Lecturer'),
        ('registra','Registra'),
        ('student','Student'),
    )
    role = models.CharField(max_length=10,choices=Roles, default = 'student')

    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="customuser_groups", #Added related_name
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="customuser_permissions", #Added related_name
        related_query_name="user",
    )

class Department(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    def __str__(self):
        return self.name

class Issue(models.Model):
    Priority_Choices=(
        ('low','Low'),
        ('meduim','Meduim'),
        ('high','High'),
    )
    Status_Choices=(
        ('open','Open'),
        ('in_progress','In Progress'),
        ('resolved','Resolved'),
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    department = models.ForeignKey(Department, on_delete = models.CASCADE)
    priority = models.CharField(max_length=10, choices=Priority_Choices, default='low')
    status = models.CharField(max_length=20,choices=Status_Choices,default='open')
    created_by = models.ForeignKey(CustomUser, on_delete = models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title