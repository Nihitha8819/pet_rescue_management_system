from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Rescue
from django.contrib.auth import get_user_model

User = get_user_model()

class RescueTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='testuser@example.com',
            password='testpassword'
        )
        self.client.login(email='testuser@example.com', password='testpassword')
        self.rescue_data = {
            'name': 'Test Rescue',
            'description': 'A test rescue description',
            'location': 'Test Location',
            'contact_info': 'test@example.com'
        }

    def test_create_rescue(self):
        response = self.client.post(reverse('rescue-list'), self.rescue_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Rescue.objects.count(), 1)
        self.assertEqual(Rescue.objects.get().name, 'Test Rescue')

    def test_get_rescue(self):
        rescue = Rescue.objects.create(**self.rescue_data)
        response = self.client.get(reverse('rescue-detail', args=[rescue.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], rescue.name)

    def test_update_rescue(self):
        rescue = Rescue.objects.create(**self.rescue_data)
        updated_data = {'name': 'Updated Rescue'}
        response = self.client.patch(reverse('rescue-detail', args=[rescue.id]), updated_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Rescue.objects.get().name, 'Updated Rescue')

    def test_delete_rescue(self):
        rescue = Rescue.objects.create(**self.rescue_data)
        response = self.client.delete(reverse('rescue-detail', args=[rescue.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Rescue.objects.count(), 0)