from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Request(models.Model):
    REQUEST_TYPE_CHOICES = [
        ('found', 'Found'),
        ('lost', 'Lost'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    pet = models.ForeignKey('pets.Pet', on_delete=models.CASCADE)
    requester = models.ForeignKey(User, on_delete=models.CASCADE)
    request_type = models.CharField(max_length=10, choices=REQUEST_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.request_type} request for {self.pet.name} by {self.requester.email}"

# Keep MatchRequest as alias for backward compatibility
MatchRequest = Request