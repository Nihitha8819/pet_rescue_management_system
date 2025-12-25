from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id',
            'recipient',
            'recipient_role',
            'title',
            'message',
            'type',
            'related_entity_id',
            'is_read',
            'created_at',
        ]
        read_only_fields = ['id', 'recipient', 'recipient_role', 'created_at']