from django.db.models import Q
from apps.pets.models import Pet
from apps.users.models import User

class MatchEngine:
    def __init__(self, user):
        self.user = user

    def find_matches(self, pet_preferences):
        # Example of filtering pets based on user preferences
        matched_pets = Pet.objects.filter(
            Q(type__in=pet_preferences['types']) |
            Q(breed__in=pet_preferences['breeds']) |
            Q(color__in=pet_preferences['colors'])
        ).exclude(created_by=self.user)

        return matched_pets

    def suggest_pets(self):
        # Example of suggesting pets based on user location and preferences
        user_location = self.user.location
        pet_preferences = self.user.pet_preferences

        matched_pets = self.find_matches(pet_preferences)

        # Further filter by location
        matched_pets = matched_pets.filter(location=user_location)

        return matched_pets

    def create_match_request(self, pet, request_type):
        # Logic to create a match request
        # This would typically involve creating a Request model instance
        from .models import Request

        match_request = Request.objects.create(
            pet=pet,
            requester=self.user,
            request_type=request_type,
            status='pending'
        )

        return match_request

    def get_user_matches(self):
        # Logic to retrieve match requests for the user
        from .models import Request

        return Request.objects.filter(requester=self.user)