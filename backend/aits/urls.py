from django.urls import include, path
from rest_framework import routers
from . import api_views
from .views import LoginView, RegisterView, IssueListCreateView

router = routers.DefaultRouter()

urlpatterns = [
    path('users/', api_views.CustomUserListView.as_view(), name='users'),
    path('users/<int:pk>/', api_views.CustomUserDetailView.as_view()),
    path('departments/', api_views.DepartmentListView.as_view()),
    path('departments/<int:pk>/', api_views.DepartmentDetailView.as_view()),
    path('issues/', api_views.IssueListView.as_view()),
    path('issues/<int:pk>/', api_views.IssueDetailView.as_view()),
    path('issues/create/', api_views.IssueCreateView.as_view()),
    path('issues/<int:pk>/update/', api_views.IssueUpdateView.as_view()),
    path('issues/<int:pk>/delete/', api_views.IssueDeleteView.as_view()),
    path('issues/', api_views.issue_list),
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('issues/', IssueListCreateView.as_view(), name='register'),
]