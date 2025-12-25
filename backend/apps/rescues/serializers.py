from rest_framework import serializers
from .models import Rescue

class RescueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rescue
        fields = '__all__'  # Include all fields from the Rescue model

class RescueDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rescue
        fields = ['id', 'name', 'description', 'location', 'status', 'created_at', 'updated_at']  # Specify fields for detailed view

class RescueCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rescue
        fields = ['name', 'description', 'location', 'status']  # Specify fields for creation and update