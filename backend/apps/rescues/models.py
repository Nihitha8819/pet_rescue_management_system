from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Rescue(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    contact_info = models.CharField(max_length=255)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class PetRescue(models.Model):
    pet_id = models.ForeignKey('pets.Pet', on_delete=models.CASCADE)
    rescue_id = models.ForeignKey(Rescue, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=[('available', 'Available'), ('adopted', 'Adopted')])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.pet_id} - {self.rescue_id}"