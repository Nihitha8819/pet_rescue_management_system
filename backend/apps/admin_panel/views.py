from rest_framework import generics
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from apps.users.models import User
from apps.pets.models import Pet
from apps.notifications.models import Notification
from apps.users.serializers import UserSerializer
from apps.pets.serializers import PetSerializer
from apps.notifications.serializers import NotificationSerializer

class AdminDashboardView(generics.GenericAPIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        stats = {
            'total_users': User.objects.count(),
            'total_pets': Pet.objects.count(),
            'pending_requests': 0,  # Add Request model count when available
            'total_notifications': Notification.objects.count(),
        }
        return Response(stats)

class ManageUsersView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]