from django.db import models
from django.contrib.auth import get_user_model
from bson import ObjectId

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

    _id = models.CharField(max_length=24, primary_key=True, db_column='_id')
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

    # Extended fields for registration and moderation
    is_vaccinated = models.BooleanField(default=False)
    is_neutered = models.BooleanField(default=False)
    special_notes = models.TextField(blank=True, default='')
    is_approved = models.BooleanField(default=True)

    @property
    def id(self):
        """Return _id as id for compatibility"""
        return self._id

    def save(self, *args, **kwargs):
        """Generate ObjectId if _id is not set"""
        if not self._id:
            self._id = str(ObjectId())
        super().save(*args, **kwargs)

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

    _id = models.CharField(max_length=24, primary_key=True, db_column='_id')
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

    def save(self, *args, **kwargs):
        """Generate ObjectId if _id is not set"""
        if not self._id:
            self._id = str(ObjectId())
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.pet_name} - {self.status}"

    class Meta:
        ordering = ['-created_at']


class PetPhoto(models.Model):
    _id = models.CharField(max_length=24, primary_key=True, db_column='_id')
    pet = models.ForeignKey(Pet, related_name='photos', on_delete=models.CASCADE)
    image_url = models.CharField(max_length=500)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def id(self):
        return self._id

    def save(self, *args, **kwargs):
        if not self._id:
            self._id = str(ObjectId())
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.pet.name} - {self.image_url}"


class AdoptionRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    _id = models.CharField(max_length=24, primary_key=True, db_column='_id')
    pet = models.ForeignKey(Pet, related_name='adoption_requests', on_delete=models.CASCADE)
    requester = models.ForeignKey(User, related_name='adoption_requests', on_delete=models.CASCADE)
    message = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def id(self):
        return self._id

    def save(self, *args, **kwargs):
        if not self._id:
            self._id = str(ObjectId())
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.pet.name} - {self.requester.email} - {self.status}"


class Review(models.Model):
    _id = models.CharField(max_length=24, primary_key=True, db_column='_id')
    pet = models.ForeignKey(Pet, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='reviews', on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def id(self):
        return self._id

    def save(self, *args, **kwargs):
        if not self._id:
            self._id = str(ObjectId())
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.pet.name} - {self.user.email} - {self.rating}"