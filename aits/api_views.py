from rest_framework import generics,status
from rest_framework.response import Response 
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from .models import CustomUser, Department, Issue
from .serializers import CustomUserSerializer,DepartmentSerializer,IssueSerializer



class CustomUserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

class CustomUserDetailView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

class DepartmentListView(generics.ListAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class DepartmentDetailView(generics.RetrieveAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class IssueListView(generics.ListAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer

class IssueDetailView(generics.RetrieveAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer

class IssueCreateView(generics.CreateAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer

class IssueUpdateView(generics.UpdateAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer

class IssueDeleteView(generics.DestroyAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer

@api_view(['GET', 'POST'])
def issue_list(request):
    # Your function-based view logic here (if any)
    if request.method == 'GET':
        issues = Issue.objects.all()
        serializer = IssueSerializer(issues, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = IssueSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)