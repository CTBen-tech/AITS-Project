from django.urls import include, path
from rest_framework import routers
from . import api_views
from .views import LoginView, RegisterView, IssueListCreateView, CustomTokenObtainPairView
from django.views.decorators.csrf import csrf_exempt

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
    
    # Auth routes
    path('login/', csrf_exempt(LoginView.as_view()), name='login'),
    path('register/', csrf_exempt(RegisterView.as_view()), name='register'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
]
