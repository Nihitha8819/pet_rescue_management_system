from django.contrib.auth import get_user_model
from .models import Notification


User = get_user_model()


def create_notification(recipient: User, title: str, message: str, *, notif_type='system', related_id=''):
    """
    Safely create a notification for a user.
    """
    if recipient and title and message:
        Notification.objects.create(
            recipient=recipient,
            recipient_role=recipient.role if hasattr(recipient, 'role') else 'user',
            title=title,
            message=message,
            type=notif_type,
            related_entity_id=related_id or '',
        )


