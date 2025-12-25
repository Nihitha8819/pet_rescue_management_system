from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import User

class UserTests(APITestCase):

    def setUp(self):
        self.user_data = {
            'email': 'testuser@example.com',
            'password': 'testpassword123',
            'phone': '1234567890',
            'user_type': 'adopter'
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_user_registration(self):
        response = self.client.post(reverse('user-register'), {
            'email': 'newuser@example.com',
            'password': 'newpassword123',
            'phone': '0987654321',
            'user_type': 'rescuer'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)

    def test_user_login(self):
        response = self.client.post(reverse('user-login'), {
            'email': self.user.email,
            'password': 'testpassword123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def test_user_profile(self):
        self.client.login(email=self.user.email, password='testpassword123')
        response = self.client.get(reverse('user-profile'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user.email)

    def test_user_update(self):
        self.client.login(email=self.user.email, password='testpassword123')
        response = self.client.patch(reverse('user-update'), {
            'phone': '1112223333'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.phone, '1112223333')

    def test_user_deletion(self):
        self.client.login(email=self.user.email, password='testpassword123')
        response = self.client.delete(reverse('user-delete'))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(User.objects.count(), 0)