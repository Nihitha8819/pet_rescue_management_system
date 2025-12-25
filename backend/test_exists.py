import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "petrescue_backend.settings")
django.setup()

from apps.users.models import User
from apps.users.serializers import UserRegisterSerializer

email = "check_exists@example.com"
print(f"Checking if {email} exists...")
try:
    exists = User.objects.filter(email=email).exists()
    print(f"Exists result: {exists}")
except Exception as e:
    print(f"Exists failed: {e}")
    import traceback
    traceback.print_exc()

data = {
    "email": email,
    "password": "testpassword123",
    "name": "Test Check",
    "user_type": "adopter"
}

serializer = UserRegisterSerializer(data=data)
print("Validating serializer...")
if serializer.is_valid():
    try:
        user = serializer.save()
        print(f"SUCCESS: User {user.email} created.")
    except Exception as e:
        print(f"Save failed: {e}")
else:
    print(f"Validation errors: {serializer.errors}")
