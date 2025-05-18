from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from .serializers import CustomUserSerializer, IssueSerializer
from .models import Issue, Department


# Create your views here.
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({'message': f' welcome, {username}'}, status=status.HTTP_200_OK)
            return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
        return Response({'error': 'invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Extract data properly
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        # Validate required fields
        if not all([username, email, password]):
            return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if username or email already exists before saving
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        # Use serializer to create user
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.is_active = True
            user.save()
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class IssueListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        issues = Issue.objects.filter(created_by=request.user)
        serializer = IssueSerializer(issues, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        title = request.data.get('title')
        description = request.data.get('description')
        department_id = request.data.get('department')
        priority = request.data.get('priority', 'low')
        status_val = request.data.get('status', 'open')

        if not all([title, description, department_id]):
            return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            department = Department.objects.get(id=department_id)
        except Department.DoesNotExist:
            return Response({'error': 'Department not found'}, status=status.HTTP_404_NOT_FOUND)

        issue = Issue.objects.create(
            title=title,
            description=description,
            department=department,
            priority=priority,
            status=status_val,
            created_by=request.user
        )

        serializer = IssueSerializer(issue)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
