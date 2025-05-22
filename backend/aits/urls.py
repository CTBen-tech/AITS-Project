from django.urls import path
from rest_framework import routers
from . import views
from . import api_views
from .views import LoginView, RegisterView, IssueListCreateView, CustomTokenObtainPairView, csrf_token_view, set_csrf_cookie
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
    path('api/login/', LoginView.as_view(), name='login'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("csrf/", csrf_token_view, name="csrf"), 
    path("set-csrf/", set_csrf_cookie, name="set-csrf"),  # Manually set CSRF cookie

    path('api/protected/', views.ProtectedView.as_view(), name='protected'),
]
