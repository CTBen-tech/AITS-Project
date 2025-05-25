from django.db import models
from django.contrib.auth.models import AbstractUser #this line imports the abstract user function in django

def get_role_prefix(role):
    role = role.lower()
    if role == 'student':
        return 'STD'
    elif role == 'lecturer':
        return 'LEC'
    elif role == 'registrar':
        return 'REG'
    elif role == 'admin':
        return 'ADM'
    else:
        return 'USR'

def generate_role_id(role):
    prefix = get_role_prefix(role)
    from .models import CustomUser  # Avoid circular import if needed
    last_user = CustomUser.objects.filter(user_id__startswith=prefix).order_by('id').last()
    if last_user and last_user.user_id:
        try:
            num = int(last_user.user_id.replace(prefix, '')) + 1
        except ValueError:
            num = 1
    else:
        num = 1
    return f"{prefix}{num:03d}"
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
        ('registrar','Registrar'),
        ('student','Student'),
    )
    role = models.CharField(max_length=10,choices=Roles, default = 'student')
    user_id = models.CharField(max_length=10, unique=True, null=True, blank=True)
    
    def save(self, *args, **kwargs):
        if not self.user_id and self.role:
            self.user_id = generate_role_id(self.role)
        super().save(*args, **kwargs)

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