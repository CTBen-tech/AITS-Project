"""
URL configuration for AITSproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.views.decorators.csrf import csrf_exempt
from aits.views import csrf_token_view, set_csrf_cookie  # Import CSRF-related views

urlpatterns = [
    path("csrf/", csrf_token_view, name="csrf"),  # CSRF token retrieval
    path("set-csrf/", set_csrf_cookie, name="set-csrf"),  # CSRF cookie setup
]


urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html')),
    path('admin/', admin.site.urls),
    path('api/', include('aits.urls')),  # This includes all your API routes
    path('api/token/', csrf_exempt(TokenObtainPairView.as_view()), name='token_obtain_pair'),
    path('api/token/refresh/', csrf_exempt(TokenRefreshView.as_view()), name='token_refresh'),
    path("csrf/", csrf_token_view, name="csrf"),  # CSRF token retrieval
    path("set-csrf/", set_csrf_cookie, name="set-csrf"),  # CSRF cookie setup

    # Removed duplicate register path since it's in aits.urls
    re_path(r'^.*', TemplateView.as_view(template_name="index.html"), name='home'),
]
