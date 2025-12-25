from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db.models import Q
from django.contrib.auth import get_user_model
from .models import Message
from .serializers import MessageSerializer

User = get_user_model()

class ChatHistoryView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        other_user_id = self.kwargs.get('user_id')
        return Message.objects.filter(
            Q(sender=user, receiver_id=other_user_id) | 
            Q(sender_id=other_user_id, receiver=user)
        ).order_by('timestamp')

class SendMessageView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        receiver_id = self.request.data.get('receiver_id')
        receiver = User.objects.get(_id=receiver_id)
        serializer.save(sender=self.request.user, receiver=receiver)

class ChatContactsView(generics.ListAPIView):
    """
    List of users the current user has chatted with, or admins if user is non-admin.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request, *args, **kwargs):
        user = request.user
        contacts = set()
        
        # Get all messages involving this user
        sent = Message.objects.filter(sender=user).values_list('receiver_id', flat=True)
        received = Message.objects.filter(receiver=user).values_list('sender_id', flat=True)
        
        contact_ids = set(sent) | set(received)
        
        # If user is normal user, also add all admins
        if user.role == 'user':
            admins = User.objects.filter(role='admin').values_list('_id', flat=True)
            contact_ids.update(admins)

        # Retrieve user objects
        contact_users = User.objects.filter(_id__in=contact_ids)
        
        from apps.users.serializers import UserSerializer
        return Response(UserSerializer(contact_users, many=True).data)
