import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "petrescue_backend.settings")
django.setup()

from apps.users.models import User
from apps.users.serializers import UserRegisterSerializer

data = {
    "email": "test_script@example.com",
    "password": "testpassword123",
    "name": "Test Script",
    "user_type": "adopter"
}

serializer = UserRegisterSerializer(data=data)
if serializer.is_valid():
    try:
        user = serializer.save()
        print(f"SUCCESS: User {user.email} created with ID {user._id}")
    except Exception as e:
        print(f"ERROR during save: {e}")
        import traceback
        traceback.print_exc()
else:
    print(f"VALIDATION ERROR: {serializer.errors}")
