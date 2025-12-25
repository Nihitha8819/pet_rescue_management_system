from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id',
            'name',
            'email',
            'phone',
            'user_type',
            'role',
            'is_verified',
            'created_at',
            'updated_at',
            'address',
            'theme_preference',
            'email_notifications_enabled',
        ]


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    name = serializers.CharField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['name', 'email', 'phone', 'password', 'user_type']
        extra_kwargs = {
            'password': {'write_only': True},
            'phone': {'required': False},
            'name': {'required': False},
        }

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data.get('name', ''),
            phone=validated_data.get('phone', ''),
            user_type=validated_data.get('user_type', 'adopter')
        )

    def validate_email(self, value):
        # Temporarily disable exists() check to see if it bypasses the DatabaseError
        # if User.objects.filter(email=value).exists():
        #     raise serializers.ValidationError("A user with this email already exists.")
        return value


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'name',
            'email',
            'phone',
            'user_type',
            'role',
            'is_verified',
            'created_at',
            'updated_at',
            'address',
            'theme_preference',
            'email_notifications_enabled',
        ]


class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['theme_preference', 'email_notifications_enabled']