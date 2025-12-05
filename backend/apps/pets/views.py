from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Pet, PetReport
from .serializers import PetSerializer, PetDetailSerializer, PetReportSerializer, PetReportCreateSerializer
import base64
import os
from django.conf import settings

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
    """POST /pets/report/create - Create new pet report with image uploads"""
    queryset = PetReport.objects.all()
    serializer_class = PetReportCreateSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def create(self, request, *args, **kwargs):
        # Handle image files
        image_paths = []
        
        # Check if images are uploaded as files
        for i in range(10):
            image_key = f'images[{i}]'
            if image_key in request.FILES:
                image_file = request.FILES[image_key]
                # Save file to media directory
                media_path = os.path.join(settings.MEDIA_ROOT, 'pet_reports')
                os.makedirs(media_path, exist_ok=True)
                
                file_name = f"{request.user.id}_{request.data.get('pet_name', 'pet')}_{i}_{image_file.name}"
                file_path = os.path.join(media_path, file_name)
                
                with open(file_path, 'wb+') as destination:
                    for chunk in image_file.chunks():
                        destination.write(chunk)
                
                # Store relative path
                image_paths.append(f'/media/pet_reports/{file_name}')
        
        # Check if images are sent as base64 strings
        if 'images' in request.data and isinstance(request.data['images'], list):
            for idx, img_data in enumerate(request.data['images'][:10]):
                if img_data and isinstance(img_data, str) and img_data.startswith('data:image'):
                    # Handle base64 image
                    try:
                        format, imgstr = img_data.split(';base64,')
                        ext = format.split('/')[-1]
                        
                        media_path = os.path.join(settings.MEDIA_ROOT, 'pet_reports')
                        os.makedirs(media_path, exist_ok=True)
                        
                        file_name = f"{request.user.id}_{request.data.get('pet_name', 'pet')}_{idx}.{ext}"
                        file_path = os.path.join(media_path, file_name)
                        
                        with open(file_path, 'wb') as f:
                            f.write(base64.b64decode(imgstr))
                        
                        image_paths.append(f'/media/pet_reports/{file_name}')
                    except Exception as e:
                        print(f"Error processing image {idx}: {str(e)}")
        
        # Create mutable copy of request data, excluding images from file upload
        data = {}
        for key, value in request.data.items():
            # Skip images[] keys - we've already processed them
            if not key.startswith('images['):
                data[key] = value
        
        # Add processed image paths
        data['images'] = image_paths
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

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