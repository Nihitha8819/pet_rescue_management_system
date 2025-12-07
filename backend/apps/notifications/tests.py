from django.test import TestCase
from .models import Notification
from django.contrib.auth import get_user_model

User = get_user_model()

class NotificationModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='testuser@example.com',
            password='testpassword'
        )
        self.notification = Notification.objects.create(
            user=self.user,
            message='Test notification',
            is_read=False
        )

    def test_notification_creation(self):
        self.assertEqual(self.notification.message, 'Test notification')
        self.assertFalse(self.notification.is_read)
        self.assertEqual(self.notification.user, self.user)

    def test_notification_str(self):
        self.assertEqual(str(self.notification), 'Test notification')  # Assuming __str__ method is defined in Notification model

class NotificationViewTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='testuser@example.com',
            password='testpassword'
        )
        self.client.login(email='testuser@example.com', password='testpassword')

    def test_get_notifications(self):
        response = self.client.get('/api/notifications/')
        self.assertEqual(response.status_code, 200)

    def test_create_notification(self):
        response = self.client.post('/api/notifications/', {
            'message': 'New notification',
            'is_read': False
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Notification.objects.count(), 1)
        self.assertEqual(Notification.objects.get().message, 'New notification')