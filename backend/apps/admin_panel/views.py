from rest_framework import generics
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from apps.users.models import User
from apps.pets.models import Pet, AdoptionRequest, Review, PetReport
from apps.notifications.models import Notification
from apps.users.serializers import UserSerializer
from apps.pets.serializers import (
    PetSerializer,
    AdoptionRequestSerializer,
    ReviewSerializer,
    PetReportSerializer,
)
from apps.notifications.utils import create_notification


class AdminDashboardView(generics.GenericAPIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        stats = {
            'total_users': User.objects.count(),
            'active_users': User.objects.filter(is_active=True).count(),
            'inactive_users': User.objects.filter(is_active=False).count(),
            'total_pets': Pet.objects.count(),
            'approved_pets': Pet.objects.filter(is_approved=True).count(),
            'pending_pet_approvals': Pet.objects.filter(is_approved=False).count(),
            'pending_adoption_requests': AdoptionRequest.objects.filter(status='pending').count(),
            'approved_adoptions': AdoptionRequest.objects.filter(status='approved').count(),
            'total_adoption_requests': AdoptionRequest.objects.count(),
            'total_reviews': Review.objects.count(),
            'total_notifications': Notification.objects.count(),
            'total_reports': PetReport.objects.count(),
            'pending_reports': PetReport.objects.filter(status='pending').count(),
            'approved_reports': PetReport.objects.filter(status='approved').count(),
            'rejected_reports': PetReport.objects.filter(status='rejected').count(),
        }
        return Response(stats)


class ManageUsersView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]


class AdminPetListView(generics.ListAPIView):
    """
    GET /api/admin/pets
    """
    queryset = Pet.objects.all().order_by('-created_at')
    serializer_class = PetSerializer
    permission_classes = [IsAdminUser]


class AdminPetStatusUpdateView(generics.UpdateAPIView):
    """
    PUT /api/admin/pets/:id/status
    """
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'pk'

    def update(self, request, *args, **kwargs):
        pet = self.get_object()
        status_value = request.data.get('status')
        is_approved = request.data.get('is_approved')

        old_is_approved = pet.is_approved
        if status_value:
            pet.status = status_value
        if is_approved is not None:
            pet.is_approved = bool(is_approved)
        pet.save()

        # Notify owner if approval state changed
        try:
            from apps.notifications.utils import create_notification

            if old_is_approved is False and pet.is_approved:
                create_notification(
                    pet.created_by,
                    f"Your pet '{pet.name}' has been approved and is now visible to adopters.",
                )
            elif old_is_approved and pet.is_approved is False:
                create_notification(
                    pet.created_by,
                    f"Your pet '{pet.name}' has been unapproved by an admin.",
                )
        except Exception:
            # Avoid breaking admin flow if notifications fail
            pass

        serializer = self.get_serializer(pet)
        return Response(serializer.data)


class AdminAdoptionRequestListView(generics.ListAPIView):
    """
    GET /api/admin/adoptions
    """
    queryset = AdoptionRequest.objects.all().order_by('-created_at')
    serializer_class = AdoptionRequestSerializer
    permission_classes = [IsAdminUser]


class AdminReviewListView(generics.ListAPIView):
    """
    GET /api/admin/reviews
    """
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer
    permission_classes = [IsAdminUser]


class AdminUserStatusUpdateView(generics.UpdateAPIView):
    """
    PUT /api/admin/users/:id/status
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'pk'

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        is_active = request.data.get('is_active')
        if is_active is not None:
            user.is_active = bool(is_active)
            user.save()
            try:
                create_notification(
                    user,
                    "Account status changed",
                    f"Your account has been {'enabled' if user.is_active else 'disabled'} by an admin.",
                    notif_type='system',
                    related_id=str(user.id),
                )
            except Exception:
                pass
        serializer = self.get_serializer(user)
        return Response(serializer.data)


class AdminPetReportStatusUpdateView(generics.UpdateAPIView):
    """
    PUT /api/admin/reports/:id/status
    - Admin can approve/reject reported pets
    """
    queryset = PetReport.objects.all()
    serializer_class = PetReportSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'pk'

    def update(self, request, *args, **kwargs):
        report = self.get_object()
        new_status = request.data.get('status')

        if new_status not in ['pending', 'approved', 'rejected', 'found', 'adopted']:
            return Response(
                {'detail': 'Invalid status value.'},
                status=400,
            )

        report.status = new_status
        report.save()

        # Notify reporting user
        try:
            create_notification(
                report.created_by,
                "Report status updated",
                f"Your report '{report.pet_name}' is now {new_status}.",
                notif_type='report',
                related_id=report._id,
            )
        except Exception:
            pass

        serializer = self.get_serializer(report)
        return Response(serializer.data)