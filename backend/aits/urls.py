from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import api_views
from .views import (
    RegisterView,
    IssueListCreateView,
    CustomTokenObtainPairView,
    csrf_token_view,
    set_csrf_cookie,
    ProtectedView,
)

urlpatterns = [
    # User routes
    path('users/', api_views.CustomUserListView.as_view(), name='users'),
    path('users/<int:pk>/', api_views.CustomUserDetailView.as_view()),

    # Department routes
    path('departments/', api_views.DepartmentListView.as_view()),
    path('departments/<int:pk>/', api_views.DepartmentDetailView.as_view()),

    # Issue routes
    path('issues/', IssueListCreateView.as_view(), name='issues'),
    path('issues/<int:pk>/', api_views.IssueDetailView.as_view()),
    path('issues/<int:pk>/update/', api_views.IssueUpdateView.as_view()),
    path('issues/<int:pk>/delete/', api_views.IssueDeleteView.as_view()),

    # JWT auth endpoints
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Auth routes
    path('register/', RegisterView.as_view(), name='register'),

    # CSRF endpoints
    path('csrf/', csrf_token_view, name='csrf'),
    path('set-csrf/', set_csrf_cookie, name='set-csrf'),

    # Protected test endpoint
    path('api/protected/', ProtectedView.as_view(), name='protected'),
]