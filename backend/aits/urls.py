from django.urls import path
from rest_framework import routers
from . import api_views
from .views import LoginView, RegisterView, IssueListCreateView, CustomTokenObtainPairView
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)

router = routers.DefaultRouter()

urlpatterns = [
    # User routes
    path('users/', api_views.CustomUserListView.as_view(), name='users'),
    path('users/<int:pk>/', api_views.CustomUserDetailView.as_view()),
    
    # Department routes
    path('departments/', api_views.DepartmentListView.as_view()),
    path('departments/<int:pk>/', api_views.DepartmentDetailView.as_view()),
    
    # Issue routes - fixed duplicate routes
    path('issues/', IssueListCreateView.as_view(), name='issues'),  # Combined list and create
    path('issues/<int:pk>/', api_views.IssueDetailView.as_view()),
    path('issues/<int:pk>/update/', api_views.IssueUpdateView.as_view()),
    path('issues/<int:pk>/delete/', api_views.IssueDeleteView.as_view()),
    
    #JWT AUTH endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),


    # Auth routes
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
]
