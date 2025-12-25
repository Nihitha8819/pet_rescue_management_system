from django.db import models
from django.contrib.auth import get_user_model
from bson import ObjectId

User = get_user_model()


class Notification(models.Model):
    """
    Persistent notifications stored per recipient.
    """
    _id = models.CharField(max_length=24, primary_key=True, db_column='_id')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    recipient_role = models.CharField(max_length=10, default='user')  # admin/user
    title = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(max_length=50, default='system')  # pet, report, adoption, system
    related_entity_id = models.CharField(max_length=64, blank=True, default='')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def id(self):
        return self._id

    def save(self, *args, **kwargs):
        if not self._id:
            self._id = str(ObjectId())
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Notification for {self.recipient.email}: {self.title}'