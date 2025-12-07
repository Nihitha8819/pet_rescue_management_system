from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'phone', 'user_type', 'role', 'is_verified', 'created_at', 'updated_at']

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
            'name': {'required': False}
        }

    def create(self, validated_data):
        user = User(
            name=validated_data.get('name', ''),
            email=validated_data['email'],
            phone=validated_data.get('phone', ''),
            user_type=validated_data.get('user_type', 'adopter')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'phone', 'user_type', 'role', 'is_verified', 'created_at', 'updated_at']