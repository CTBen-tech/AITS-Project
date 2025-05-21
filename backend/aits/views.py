from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, get_user_model
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import CustomUserSerializer, RegisterSerializer, IssueSerializer
from .models import Issue, Department
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

User = get_user_model()

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            return Response({'message': f'Welcome, {username}'}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
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

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        try:
            token['role'] = user.profile.role
        except AttributeError:
            token['role'] = 'student'
        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user = serializer.user
        try:
            role = user.profile.role
        except AttributeError:
            role = 'student'
        return Response({
            'access': str(data['access']),
            'refresh': str(data['refresh']),
            'role': role
        }, status=status.HTTP_200_OK)

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'message': f'Hello, {request.user.username}! This is a protected endpoint.'})