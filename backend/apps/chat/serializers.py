from rest_framework import serializers
from .models import Message
from apps.users.serializers import UserSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    sender_id = serializers.CharField(write_only=True)
    receiver_id = serializers.CharField(write_only=True)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'sender_id', 'receiver_id', 'content', 'timestamp', 'is_read']
        read_only_fields = ['id', 'sender', 'receiver', 'timestamp', 'is_read']

    def create(self, validated_data):
        # We handle sender/receiver lookup in view usually, but for write_only fields:
        # Actually sender comes from request.user
        return super().create(validated_data)
