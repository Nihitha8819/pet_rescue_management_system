import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'petrescue_backend.settings')
django.setup()

from apps.users.models import User
from bson import ObjectId

try:
    print("Creating test user...")
    user = User(
        name='Test User',
        email='testuser999@example.com',
        phone='+1234567890',
        user_type='adopter'
    )
    print(f"User object created, _id before save: {user._id}")
    user.set_password('testpass123')
    print("Password set")
    user.save()
    print(f"User saved successfully! _id: {user._id}")
    print(f"User details: email={user.email}, name={user.name}")
except Exception as e:
    print(f"ERROR: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
