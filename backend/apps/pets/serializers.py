from rest_framework import serializers
from django.db import models
from .models import Pet, PetReport, PetPhoto, AdoptionRequest, Review
from apps.users.serializers import UserSerializer


class PetSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Pet
        fields = '__all__'
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']


class PetPhotoSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)

    class Meta:
        model = PetPhoto
        fields = ['id', 'image_url', 'is_primary', 'created_at']


class PetDetailSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)
    created_by = UserSerializer(read_only=True)
    photos = PetPhotoSerializer(many=True, read_only=True)
    reviews = serializers.SerializerMethodField()
    adoption_status = serializers.CharField(source='status', read_only=True)

    class Meta:
        model = Pet
        fields = [
            'id',
            'name',
            'pet_type',
            'breed',
            'color',
            'gender',
            'size',
            'age',
            'description',
            'status',
            'location',
            'images',
            'is_vaccinated',
            'is_neutered',
            'special_notes',
            'is_approved',
            'created_by',
            'created_at',
            'updated_at',
            'photos',
            'reviews',
            'adoption_status',
        ]

    def get_reviews(self, obj):
        reviews = obj.reviews.all().order_by('-created_at')
        return ReviewSerializer(reviews, many=True).data


class PetSearchSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)
    primary_image = serializers.SerializerMethodField()
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Pet
        fields = [
            'id',
            'name',
            'pet_type',
            'breed',
            'status',
            'primary_image',
            'images',
            'location',
            'age',
            'description',
            'is_approved',
            'created_by',
        ]

    def get_primary_image(self, obj):
        if obj.images and isinstance(obj.images, list) and len(obj.images) > 0:
            return obj.images[0]
        return None


class PetRegisterSerializer(serializers.ModelSerializer):
    """Serializer used for /api/pets/register."""
    class Meta:
        model = Pet
        fields = [
            'name',
            'pet_type',
            'breed',
            'gender',
            'color',
            'age',
            'size',
            'description',
            'location',
            'is_vaccinated',
            'is_neutered',
            'special_notes',
        ]


class PetReportSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = PetReport
        fields = '__all__'
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']


class PetReportCreateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.CharField(max_length=1000),
        required=False,
        allow_empty=True,
        max_length=10,
    )
    
    class Meta:
        model = PetReport
        fields = ['pet_name', 'pet_type', 'description', 'location_found', 'contact_info', 'images']


class AdoptionRequestSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)
    petitioner = UserSerializer(source='requester', read_only=True)
    pet = PetSearchSerializer(read_only=True)

    class Meta:
        model = AdoptionRequest
        fields = ['id', 'pet', 'petitioner', 'message', 'status', 'created_at']


class AdoptionRequestCreateSerializer(serializers.ModelSerializer):
    pet_id = serializers.CharField(write_only=True)

    class Meta:
        model = AdoptionRequest
        fields = ['pet_id', 'message']

    def validate(self, attrs):
        request = self.context['request']
        pet_id = attrs['pet_id']

        try:
            pet = Pet.objects.get(_id=pet_id)
        except Pet.DoesNotExist:
            raise serializers.ValidationError({'pet_id': 'Pet not found'})

        if pet.created_by_id == request.user.id:
            raise serializers.ValidationError('You cannot adopt your own pet.')

        if AdoptionRequest.objects.filter(
            pet=pet, requester=request.user, status='pending'
        ).exists():
            raise serializers.ValidationError(
                'You already have a pending request for this pet.'
            )

        attrs['pet'] = pet
        return attrs

    def create(self, validated_data):
        request = self.context['request']
        pet = validated_data['pet']
        message = validated_data.get('message', '')
        return AdoptionRequest.objects.create(
            pet=pet,
            requester=request.user,
            message=message,
        )


class ReviewSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'pet', 'user', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class ReviewCreateSerializer(serializers.ModelSerializer):
    pet_id = serializers.CharField(write_only=True)

    class Meta:
        model = Review
        fields = ['pet_id', 'rating', 'comment']

    def validate_rating(self, value):
        if not (1 <= value <= 5):
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        return value

    def validate(self, attrs):
        request = self.context['request']
        pet_id = attrs['pet_id']

        try:
            pet = Pet.objects.get(_id=pet_id)
        except Pet.DoesNotExist:
            raise serializers.ValidationError({'pet_id': 'Pet not found'})

        if Review.objects.filter(pet=pet, user=request.user).exists():
            raise serializers.ValidationError('You have already reviewed this pet.')

        attrs['pet'] = pet
        return attrs

    def create(self, validated_data):
        request = self.context['request']
        pet = validated_data['pet']
        rating = validated_data['rating']
        comment = validated_data.get('comment', '')
        return Review.objects.create(
            pet=pet, user=request.user, rating=rating, comment=comment
        )
