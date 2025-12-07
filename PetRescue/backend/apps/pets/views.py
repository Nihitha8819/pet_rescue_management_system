from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.views import APIView
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
    """GET /pets/all - List all pets with search and filter support"""
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by pet type
        pet_type = self.request.query_params.get('type', None)
        if pet_type:
            queryset = queryset.filter(pet_type=pet_type)
        
        # Filter by status
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        
        # Search by name, breed, location, or description
        search = self.request.query_params.get('search', None)
        if search:
            from django.db.models import Q
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(breed__icontains=search) |
                Q(location__icontains=search) |
                Q(description__icontains=search)
            )
        
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
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Preserve current status if not explicitly provided
        if 'status' not in request.data:
            request.data['status'] = instance.status
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(serializer.data)

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
        
        # Non-admin users only see active reports
        user = self.request.user
        if not user.is_authenticated or (user.role != 'admin' and not user.is_staff):
            queryset = queryset.filter(status='active')
        
        # Filter by pet type
        pet_type = self.request.query_params.get('type', None)
        if pet_type:
            queryset = queryset.filter(pet_type=pet_type)
        
        # Filter by status
        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        # Search by pet name, description, or location
        search = self.request.query_params.get('search', None)
        if search:
            from django.db.models import Q
            queryset = queryset.filter(
                Q(pet_name__icontains=search) |
                Q(description__icontains=search) |
                Q(location_found__icontains=search)
            )
        
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

class PetReportDetailView(generics.RetrieveAPIView):
    """GET /pets/report/<id> - Get pet report details"""
    queryset = PetReport.objects.all()
    serializer_class = PetReportSerializer
    permission_classes = [AllowAny]

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


class MarkPetAsFoundView(APIView):
    """POST /pets/report/<pk>/mark-found - Mark pet as found by report owner"""
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            report = PetReport.objects.get(pk=pk)
            
            # Only the report owner can mark it as found
            if report.created_by != request.user:
                return Response(
                    {'error': 'You can only mark your own reports as found'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Update status to found
            report.status = 'found'
            report.save()
            
            serializer = PetReportSerializer(report)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except PetReport.DoesNotExist:
            return Response(
                {'error': 'Pet report not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class AdminActivateReportView(APIView):
    """POST /admin/reports/<pk>/activate - Admin activates/approves a pet report"""
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        # Check if user is admin
        if not (request.user.role == 'admin' or request.user.is_staff):
            return Response(
                {'error': 'Only admins can activate reports'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            report = PetReport.objects.get(pk=pk)
            
            # Activate the report
            report.status = 'active'
            report.save()
            
            serializer = PetReportSerializer(report)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except PetReport.DoesNotExist:
            return Response(
                {'error': 'Pet report not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class AdminUpdateReportStatusView(APIView):
    """PUT /admin/reports/<pk>/status - Admin updates report status to any value"""
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        # Check if user is admin
        if not (request.user.role == 'admin' or request.user.is_staff):
            return Response(
                {'error': 'Only admins can update report status'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            report = PetReport.objects.get(pk=pk)
            
            new_status = request.data.get('status')
            if not new_status:
                return Response(
                    {'error': 'Status field is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate status is in allowed choices
            valid_statuses = [choice[0] for choice in PetReport.STATUS_CHOICES]
            if new_status not in valid_statuses:
                return Response(
                    {'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Update the report status
            report.status = new_status
            report.save()
            
            serializer = PetReportSerializer(report)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except PetReport.DoesNotExist:
            return Response(
                {'error': 'Pet report not found'},
                status=status.HTTP_404_NOT_FOUND
            )
