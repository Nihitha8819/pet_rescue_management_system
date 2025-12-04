from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response
from .models import Pet, PetReport
from .serializers import PetSerializer, PetDetailSerializer, PetReportSerializer, PetReportCreateSerializer

# Pet Views
class PetCreateView(generics.CreateAPIView):
    """POST /pets/create - Create new pet listing"""
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class PetListView(generics.ListAPIView):
    """GET /pets/all - List all pets"""
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        pet_type = self.request.query_params.get('type', None)
        status = self.request.query_params.get('status', None)
        
        if pet_type:
            queryset = queryset.filter(pet_type=pet_type)
        if status:
            queryset = queryset.filter(status=status)
        
        return queryset.order_by('-created_at')

class UserPetListView(generics.ListAPIView):
    """GET /pets/user/<id> - Get pets by user"""
    serializer_class = PetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return Pet.objects.filter(created_by_id=user_id).order_by('-created_at')

class PetDetailView(generics.RetrieveAPIView):
    """GET /pets/<id> - Get pet details"""
    queryset = Pet.objects.all()
    serializer_class = PetDetailSerializer
    permission_classes = [AllowAny]

class PetUpdateView(generics.UpdateAPIView):
    """PUT /pets/update/<id> - Update pet"""
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can only update their own pets
        return Pet.objects.filter(created_by=self.request.user)

class PetDeleteView(generics.DestroyAPIView):
    """DELETE /pets/delete/<id> - Delete pet"""
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can only delete their own pets
        return Pet.objects.filter(created_by=self.request.user)

# PetReport Views
class PetReportCreateView(generics.CreateAPIView):
    """POST /pets/report/create - Create new pet report"""
    queryset = PetReport.objects.all()
    serializer_class = PetReportCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class PetReportListView(generics.ListAPIView):
    """GET /pets/reports - List all pet reports"""
    queryset = PetReport.objects.all()
    serializer_class = PetReportSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        status = self.request.query_params.get('status', None)
        
        if status:
            queryset = queryset.filter(status=status)
        
        return queryset.order_by('-created_at')

class UserPetReportListView(generics.ListAPIView):
    """GET /pets/reports/user/<id> - Get reports by user"""
    serializer_class = PetReportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return PetReport.objects.filter(created_by_id=user_id).order_by('-created_at')

class AdminPetReportListView(generics.ListAPIView):
    """GET /admin/reports - Get all reports for admin"""
    queryset = PetReport.objects.all()
    serializer_class = PetReportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Check if user is admin
        if not (self.request.user.role == 'admin' or self.request.user.is_staff):
            return PetReport.objects.none()
        return PetReport.objects.all().order_by('-created_at')

class PetReportUpdateView(generics.UpdateAPIView):
    """PUT /pets/report/update/<id> - Update pet report status"""
    queryset = PetReport.objects.all()
    serializer_class = PetReportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Admins can update any report, users can update their own
        if self.request.user.role == 'admin' or self.request.user.is_staff:
            return PetReport.objects.all()
        return PetReport.objects.filter(created_by=self.request.user)