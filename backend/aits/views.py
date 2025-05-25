from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from .serializers import (
    RegisterSerializer,
    IssueSerializer,
    CustomTokenObtainPairSerializer,
)
from .models import Issue
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse

User = get_user_model()

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

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class IssueListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        issues = Issue.objects.filter(created_by=request.user)
        serializer = IssueSerializer(issues, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = IssueSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@ensure_csrf_cookie
def csrf_token_view(request):
    return JsonResponse({'detail': 'CSRF cookie set'})

def set_csrf_cookie(request):
    response = JsonResponse({'detail': 'CSRF cookie set'})
    response.set_cookie('csrftoken', request.COOKIES.get('csrftoken'))
    return response

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'message': 'This is a protected view'}, status=status.HTTP_200_OK)