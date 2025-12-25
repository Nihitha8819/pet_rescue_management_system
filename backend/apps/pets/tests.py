from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Pet
from django.contrib.auth import get_user_model

User = get_user_model()

class PetTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='testuser@example.com',
            password='testpassword'
        )
        self.client.login(email='testuser@example.com', password='testpassword')
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

    def test_create_pet(self):
        response = self.client.post(reverse('pet-list'), self.pet_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Pet.objects.count(), 1)
        self.assertEqual(Pet.objects.get().name, 'Buddy')

    def test_get_pet(self):
        pet = Pet.objects.create(**self.pet_data)
        response = self.client.get(reverse('pet-detail', args=[pet.id]), format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], pet.name)

    def test_update_pet(self):
        pet = Pet.objects.create(**self.pet_data)
        updated_data = {'name': 'Max'}
        response = self.client.patch(reverse('pet-detail', args=[pet.id]), updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        pet.refresh_from_db()
        self.assertEqual(pet.name, 'Max')

    def test_delete_pet(self):
        pet = Pet.objects.create(**self.pet_data)
        response = self.client.delete(reverse('pet-detail', args=[pet.id]), format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Pet.objects.count(), 0)