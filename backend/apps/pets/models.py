from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Pet(models.Model):
    PET_TYPE_CHOICES = [
        ('dog', 'Dog'),
        ('cat', 'Cat'),
        ('other', 'Other'),
    ]

    SIZE_CHOICES = [
        ('small', 'Small'),
        ('medium', 'Medium'),
        ('large', 'Large'),
    ]

    _id = models.AutoField(primary_key=True, db_column='_id')
    name = models.CharField(max_length=100)
    pet_type = models.CharField(max_length=10, choices=PET_TYPE_CHOICES)
    breed = models.CharField(max_length=100)
    color = models.CharField(max_length=50)
    gender = models.CharField(max_length=10)
    size = models.CharField(max_length=10, choices=SIZE_CHOICES)
    age = models.PositiveIntegerField()
    description = models.TextField()
    status = models.CharField(max_length=20, default='available')
    location = models.CharField(max_length=255)
    images = models.JSONField()  # Store image URLs in a JSON field
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def id(self):
        """Return _id as id for compatibility"""
        return self._id

    def __str__(self):
        return self.name


class PetReport(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('found', 'Found'),
        ('adopted', 'Adopted'),
    ]

    PET_TYPE_CHOICES = [
        ('dog', 'Dog'),
        ('cat', 'Cat'),
        ('bird', 'Bird'),
        ('rabbit', 'Rabbit'),
        ('other', 'Other'),
    ]

    _id = models.AutoField(primary_key=True, db_column='_id')
    pet_name = models.CharField(max_length=100)
    pet_type = models.CharField(max_length=20, choices=PET_TYPE_CHOICES)
    description = models.TextField()
    location_found = models.CharField(max_length=255)
    contact_info = models.CharField(max_length=255)
    images = models.JSONField(default=list, blank=True)  # Store up to 10 image paths
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pet_reports')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def id(self):
        """Return _id as id for compatibility"""
        return self._id

    def __str__(self):
        return f"{self.pet_name} - {self.status}"

    class Meta:
        ordering = ['-created_at']