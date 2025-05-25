from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import CustomUser, Department, Issue
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

# User Serializer
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'role', 'password',
            'is_student', 'is_lecturer', 'is_admin', 'is_registra'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        role = validated_data.pop('role', None)
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_student=validated_data.get('is_student', False),
            is_lecturer=validated_data.get('is_lecturer', False),
            is_admin=validated_data.get('is_admin', False),
            is_registra=validated_data.get('is_registra', False),
        )
        if role is not None:
            user.role = role
        user.is_active = True
        user.save()
        return user

# Registration Serializer (used by the /register/ endpoint)
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=CustomUser.Roles)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with that username already exists.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value

    def create(self, validated_data):
        role = validated_data.get('role')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )

        # Set role
        user.role = role

        # Set appropriate boolean flags
        user.is_student = role == 'student'
        user.is_lecturer = role == 'lecturer'
        user.is_registra = role == 'registrar'
        user.is_admin = role == 'admin'

        user.is_active = True
        user.save()
        return user

# Department Serializer
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'description']

# Issue Serializer
class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = [
            'id', 'title', 'description', 'department',
            'priority', 'status', 'created_by', 'created_at'
        ]

# Custom JWT Token Serializer
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['role'] = user.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role
        return data
