from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    USER_TYPE_CHOICES = (
        ('adopter', 'Adopter'),
        ('rescuer', 'Rescuer'),
        ('admin', 'Admin'),
    )

    ROLE_CHOICES = (
        ('user', 'User'),
        ('admin', 'Admin'),
    )

    _id = models.AutoField(primary_key=True, db_column='_id')
    name = models.CharField(max_length=255, default='')
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, default='')
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    @property
    def id(self):
        """Return _id as id for compatibility with JWT and Django"""
        return self._id