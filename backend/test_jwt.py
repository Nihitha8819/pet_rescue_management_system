import os
import django
import sys

# Add backend to path
sys.path.insert(0, os.path.dirname(__file__))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'petrescue_backend.settings')
django.setup()

from apps.users.models import User
from rest_framework_simplejwt.tokens import RefreshToken

print("=" * 60)
print("Testing JWT Token Generation")
print("=" * 60)

email = 'kalyandornadula@gmail.com'

try:
    user = User.objects.get(email=email)
    print(f"\n✓ User found: {user.name}")
    print(f"  User ID (_id): {user._id}")
    print(f"  User ID (pk): {user.pk}")
    print(f"  User ID (id): {user.id}")
    
    print(f"\nAttempting to generate JWT token...")
    refresh = RefreshToken.for_user(user)
    
    print(f"✓ Refresh token generated successfully!")
    print(f"  Refresh: {str(refresh)[:50]}...")
    print(f"  Access: {str(refresh.access_token)[:50]}...")
    
except Exception as e:
    print(f"\n✗ Error: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
