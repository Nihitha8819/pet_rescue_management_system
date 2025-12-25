import os
import django
import sys

# Add backend to path
sys.path.insert(0, os.path.dirname(__file__))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'petrescue_backend.settings')
django.setup()

from django.contrib.auth import authenticate
from apps.users.models import User

print("=" * 60)
print("Testing Login Functionality")
print("=" * 60)

# Test 1: Check if user exists
email = 'kalyandornadula@gmail.com'
try:
    user = User.objects.get(email=email)
    print(f"\n✓ User found: {user.name} (ID: {user._id})")
    print(f"  Email: {user.email}")
    print(f"  User Type: {user.user_type}")
except User.DoesNotExist:
    print(f"\n✗ User with email {email} not found")
    sys.exit(1)

# Test 2: Test password check
password = 'Kalyan@123'
print(f"\nTesting password authentication...")
try:
    is_valid = user.check_password(password)
    print(f"  Password valid: {is_valid}")
    
    if not is_valid:
        print(f"\n  Trying to see what password hash looks like:")
        print(f"  Stored hash: {user.password[:50]}...")
except Exception as e:
    print(f"  ✗ Error checking password: {e}")
    import traceback
    traceback.print_exc()

# Test 3: Test Django authenticate()
print(f"\nTesting Django authenticate()...")
try:
    from apps.users.backends import EmailBackend
    backend = EmailBackend()
    authenticated_user = backend.authenticate(request=None, email=email, password=password)
    if authenticated_user:
        print(f"  ✓ Authentication successful: {authenticated_user.name}")
    else:
        print(f"  ✗ Authentication failed - returned None")
except Exception as e:
    print(f"  ✗ Error during authentication: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
print("TEST COMPLETE")
print("=" * 60)
