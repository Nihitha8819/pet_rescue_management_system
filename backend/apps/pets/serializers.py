from rest_framework import serializers
from .models import Pet, PetReport
from apps.users.serializers import UserSerializer

class PetSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Pet
        fields = '__all__'
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

class PetDetailSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Pet
        fields = ['id', 'name', 'pet_type', 'breed', 'color', 'gender', 'size', 'age', 'description', 'status', 'location', 'images', 'created_by', 'created_at', 'updated_at']

class PetReportSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = PetReport
        fields = '__all__'
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

class PetReportCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetReport
        fields = ['pet_name', 'pet_type', 'description', 'location_found', 'contact_info', 'image_url']