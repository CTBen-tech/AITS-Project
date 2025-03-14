from rest_framework import serializers
from .models import CustomUser, Department, Issue

class CustomUserSerializer(serializers.ModelSerializer):
    class meta:
        model = CustomUser
        fields = ['id','username','email','role']

class DepartmentSerializer(serializers.ModelSerializer):
    class meta:
        model = Department
        fields = ['id','name','description']

class IssueSerializer(serializers.ModelSerializer):
    class meta:
        model = Issue
        fields = ['id','title','description','department','priority','status','created_by','created_at']

