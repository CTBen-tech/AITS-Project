from rest_framework import serializers
from .models import CustomUser, Department, Issue

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id','username','email','role','password','is_student','is_lecturer','is_admin','is_registra']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_student=validated_data.get('is_student', False),
            is_lecturer=validated_data.get('is_lecturer', False),
            is_admin=validated_data.get('is_admin', False),
            is_registra=validated_data.get('is_registra', False)
        )
        return user


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id','name','description']

class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = ['id','title','description','department','priority','status','created_by','created_at']

