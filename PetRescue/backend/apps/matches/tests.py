# ...existing code...
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

# try to import Pet if present
try:
    from apps.pets.models import Pet
except Exception:
    Pet = None

from .models import Request

User = get_user_model()

class MatchTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='testuser@example.com', password='testpassword')

        # create a Pet instance if Pet model exists to avoid assuming id=1
        if Pet is not None:
            pet_kwargs = {'name': 'Buddy', 'created_by': self.user}
            # best-effort populate common fields if defined on the model
            pet_kwargs.update({
                k: v for k, v in {
                    'type': 'Dog',
                    'breed': 'Golden Retriever',
                    'color': 'Golden',
                    'gender': 'Male',
                    'size': 'Large',
                    'age': 3,
                    'description': 'Friendly and playful',
                    'status': 'found',
                }.items()
            })
            try:
                pet_kwargs['location'] = {'type': 'Point', 'coordinates': [0.0, 0.0]}
            except Exception:
                pass
            self.pet = Pet.objects.create(**pet_kwargs)
        else:
            self.pet = None

        req_kwargs = {
            'pet': self.pet,
            'requester': self.user,
            'request_type': 'found',
            'status': 'pending',
            'admin_comment': ''
        }
        if self.pet is None:
            req_kwargs.pop('pet', None)

        self.match_request = Request.objects.create(**req_kwargs)
        self.client.force_authenticate(user=self.user)

    def test_request_exists(self):
        self.assertTrue(Request.objects.filter(requester=self.user).exists())

    def test_get_requests(self):
        url = reverse('match-request-list')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        data = resp.data.get('results') if isinstance(resp.data, dict) and 'results' in resp.data else resp.data
        self.assertGreaterEqual(len(data), 1)

    def test_update_request(self):
        url = reverse('match-request-detail', args=[self.match_request.id])
        resp = self.client.patch(url, {'status': 'approved', 'admin_comment': 'Approved'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.match_request.refresh_from_db()
        self.assertEqual(self.match_request.status, 'approved')

    def test_delete_request(self):
        url = reverse('match-request-detail', args=[self.match_request.id])
        resp = self.client.delete(url)
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Request.objects.filter(id=self.match_request.id).exists())
# ...existing code...from django.urls import reverse
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