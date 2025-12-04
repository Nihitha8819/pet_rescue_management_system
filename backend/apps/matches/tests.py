from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Request
from django.contrib.auth import get_user_model

User = get_user_model()

class MatchTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='testuser@example.com',
            password='testpassword'
        )
        self.pet_data = {
            'name': 'Buddy',
            'type': 'Dog',
            'breed': 'Golden Retriever',
            'color': 'Golden',
            'gender': 'Male',
            'size': 'Large',
            'age': 3,
            'description': 'Friendly and playful',
            'status': 'Available',
            'location': 'New York',
            'images': [],
            'created_by': self.user.id
        }
        self.request_data = {
            'pet': 1,  # Assuming pet with ID 1 exists
            'requester': self.user.id,
            'request_type': 'Adopt',
            'status': 'Pending',
            'admin_comment': ''
        }

    def test_create_match_request(self):
        response = self.client.post(reverse('match-request-list'), self.request_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Request.objects.count(), 1)
        self.assertEqual(Request.objects.get().requester, self.user)

    def test_get_match_requests(self):
        self.client.post(reverse('match-request-list'), self.request_data)
        response = self.client.get(reverse('match-request-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_update_match_request(self):
        match_request = self.client.post(reverse('match-request-list'), self.request_data)
        updated_data = {
            'status': 'Approved',
            'admin_comment': 'Approved for adoption'
        }
        response = self.client.patch(reverse('match-request-detail', args=[match_request.data['id']]), updated_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Request.objects.get(id=match_request.data['id']).status, 'Approved')

    def test_delete_match_request(self):
        match_request = self.client.post(reverse('match-request-list'), self.request_data)
        response = self.client.delete(reverse('match-request-detail', args=[match_request.data['id']]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Request.objects.count(), 0)