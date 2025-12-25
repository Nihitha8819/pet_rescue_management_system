from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.exceptions import PermissionDenied
from django.db import models
from .models import Pet, PetReport, PetPhoto, AdoptionRequest, Review
from .serializers import (
    PetSerializer,
    PetDetailSerializer,
    PetReportSerializer,
    PetReportCreateSerializer,
    PetRegisterSerializer,
    PetSearchSerializer,
    AdoptionRequestSerializer,
    AdoptionRequestCreateSerializer,
    ReviewSerializer,
    ReviewCreateSerializer,
)
import base64
import os
from django.conf import settings
from apps.notifications.utils import create_notification

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
    serializer_class = PetSearchSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        # Stable queryset
        return Pet.objects.all().order_by('-created_at')


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


class PetRegisterView(generics.CreateAPIView):
    """
    POST /api/pets/register
    - Authenticated users
    - multipart/form-data
    - First image is primary
    - Default status = available
    - is_approved = False (for admin moderation)
    """
    queryset = Pet.objects.all()
    serializer_class = PetRegisterSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        # Map frontend fields to backend schema
        data['pet_type'] = data.get('species', data.get('pet_type', 'dog'))
        data['description'] = data.get('description', data.get('notes', ''))
        data['special_notes'] = data.get('notes', '')

        vaccinated = str(data.get('vaccinated', data.get('is_vaccinated', ''))).lower()
        neutered = str(data.get('neutered', data.get('is_neutered', ''))).lower()
        data['is_vaccinated'] = vaccinated in ['true', '1', 'yes', 'on']
        data['is_neutered'] = neutered in ['true', '1', 'yes', 'on']

        if not data.get('location'):
            data['location'] = 'Unknown'

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        pet = serializer.save(
            created_by=request.user,
            status='available',
            is_approved=False,
            images=[],
        )

        # Handle images
        image_urls = []
        files = request.FILES.getlist('images')
        media_path = os.path.join(settings.MEDIA_ROOT, 'pets')
        os.makedirs(media_path, exist_ok=True)

        for index, image_file in enumerate(files):
            file_name = f"{pet._id}_{index}_{image_file.name}"
            file_path = os.path.join(media_path, file_name)
            with open(file_path, 'wb+') as destination:
                for chunk in image_file.chunks():
                    destination.write(chunk)

            rel_url = f"/media/pets/{file_name}"
            image_urls.append(rel_url)

            PetPhoto.objects.create(
                pet=pet,
                image_url=rel_url,
                is_primary=(index == 0),
            )

        pet.images = image_urls
        pet.save()

        # Notifications: owner + admins
        try:
            create_notification(
                request.user,
                "Pet submitted for approval",
                f"Your pet '{pet.name}' has been submitted for approval.",
                notif_type='pet',
                related_id=pet._id,
            )
        except Exception:
            pass

        try:
            from apps.users.models import User
            for admin in User.objects.filter(role='admin'):
                create_notification(
                    admin,
                    "New pet submitted",
                    f"New pet '{pet.name}' submitted for approval.",
                    notif_type='pet',
                    related_id=pet._id,
                )
        except Exception:
            pass

        detail_data = PetDetailSerializer(pet).data
        headers = self.get_success_headers(detail_data)
        return Response(detail_data, status=status.HTTP_201_CREATED, headers=headers)


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
        report = serializer.save(created_by=self.request.user)
        # Notify admins of new report
        try:
            from apps.users.models import User
            for admin in User.objects.filter(role='admin'):
                create_notification(
                    admin,
                    "New pet report submitted",
                    f"Report for '{report.pet_name}' requires review.",
                    notif_type='report',
                    related_id=report._id,
                )
        except Exception:
            pass

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

    def update(self, request, *args, **kwargs):
        report = self.get_object()
        response = super().update(request, *args, **kwargs)
        # If admin updated, notify reporting user
        try:
            if request.user.role == 'admin' or request.user.is_staff:
                new_status = request.data.get('status')
                if new_status:
                    create_notification(
                        report.created_by,
                        "Report status updated",
                        f"Your report '{report.pet_name}' is now {new_status}.",
                        notif_type='report',
                        related_id=report._id,
                    )
        except Exception:
            pass
        return response


class AdoptionRequestCreateView(generics.CreateAPIView):
    """
    POST /api/adoptions/request
    """
    serializer_class = AdoptionRequestCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx

    def perform_create(self, serializer):
        adoption = serializer.save()
        # Notify pet owner of new request
        try:
            owner = adoption.pet.created_by
            create_notification(
                owner,
                "New adoption request",
                f"New adoption request for {adoption.pet.name} from {adoption.requester.name or adoption.requester.email}.",
                notif_type='adoption',
                related_id=adoption._id,
            )
        except Exception:
            pass


class AdoptionRequestsByPetView(generics.ListAPIView):
    """
    GET /api/adoptions/pet/:petId
    """
    serializer_class = AdoptionRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        pet_id = self.kwargs.get('pet_id')
        return AdoptionRequest.objects.filter(pet_id=pet_id).order_by('-created_at')


class AdoptionRequestsByUserView(generics.ListAPIView):
    """
    GET /api/adoptions/user
    """
    serializer_class = AdoptionRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AdoptionRequest.objects.filter(
            requester=self.request.user
        ).order_by('-created_at')


class AdoptionRequestStatusUpdateView(generics.UpdateAPIView):
    """
    PUT /api/adoptions/:id/status
    Admin or pet owner only.
    """
    serializer_class = AdoptionRequestSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'
    queryset = AdoptionRequest.objects.all()

    def update(self, request, *args, **kwargs):
        adoption = self.get_object()
        user = request.user

        is_admin = user.role == 'admin' or user.is_staff
        is_owner = adoption.pet.created_by_id == user.id

        if not (is_admin or is_owner):
            raise PermissionDenied('You are not allowed to update this request.')

        new_status = request.data.get('status')
        if new_status not in ['approved', 'rejected']:
            return Response(
                {'detail': 'Invalid status. Must be "approved" or "rejected".'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        adoption.status = new_status
        adoption.save()

        pet = adoption.pet

        # Notify requester about decision
        try:
            if new_status == 'approved':
                create_notification(
                    adoption.requester,
                    "Adoption approved",
                    f"Your adoption request for {pet.name} has been approved!",
                    notif_type='adoption',
                    related_id=adoption._id,
                )
            elif new_status == 'rejected':
                create_notification(
                    adoption.requester,
                    "Adoption rejected",
                    f"Your adoption request for {pet.name} has been rejected.",
                    notif_type='adoption',
                    related_id=adoption._id,
                )
        except Exception:
            pass

        if new_status == 'approved':
            pet.status = 'adopted'
            pet.save()
            AdoptionRequest.objects.filter(
                pet=pet, status='pending'
            ).exclude(pk=adoption.pk).update(status='rejected')

        serializer = self.get_serializer(adoption)
        return Response(serializer.data)


class ReviewCreateView(generics.CreateAPIView):
    """
    POST /api/reviews
    """
    serializer_class = ReviewCreateSerializer
    permission_classes = [AllowAny] # will be overridden below

    def get_permissions(self):
        # Enforce authentication for creating reviews
        return [IsAuthenticated()]

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx

    def perform_create(self, serializer):
        review = serializer.save()
        # Notify pet owner of new review
        try:
            owner = review.pet.created_by
            create_notification(
                owner,
                f"Your pet '{review.pet.name}' received a new review (rating {review.rating}/5).",
            )
        except Exception:
            pass


class ReviewsByPetView(generics.ListAPIView):
    """
    GET /api/reviews/pet/:petId
    """
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        pet_id = self.kwargs.get('pet_id')
        return Review.objects.filter(pet_id=pet_id).order_by('-created_at')
