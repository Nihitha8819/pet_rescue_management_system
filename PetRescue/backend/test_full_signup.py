import os
import sys
import django

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'petrescue_backend.settings')
django.setup()

from apps.users.serializers import UserRegisterSerializer
from rest_framework.test import APIRequestFactory
from apps.users.views import RegisterView

# Test data
test_data = {
    'name': 'Random Test User',
    'email': 'randomtest123@example.com',
    'phone': '+9876543210',
    'password': 'testpassword123',
    'user_type': 'adopter'
}

print("=" * 50)
print("Testing Signup API")
print("=" * 50)
print(f"\nTest Data:")
for key, value in test_data.items():
    if key == 'password':
        print(f"  {key}: {'*' * len(value)}")
    else:
        print(f"  {key}: {value}")

print("\n" + "-" * 50)
print("Step 1: Testing Serializer")
print("-" * 50)

try:
    serializer = UserRegisterSerializer(data=test_data)
    if serializer.is_valid():
        print("✓ Serializer validation: PASSED")
        print(f"  Validated data: {serializer.validated_data}")
    else:
        print("✗ Serializer validation: FAILED")
        print(f"  Errors: {serializer.errors}")
        sys.exit(1)
except Exception as e:
    print(f"✗ Serializer error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n" + "-" * 50)
print("Step 2: Creating User via Serializer")
print("-" * 50)

try:
    user = serializer.save()
    print("✓ User created successfully!")
    print(f"  User ID (_id): {user._id}")
    print(f"  Email: {user.email}")
    print(f"  Name: {user.name}")
    print(f"  Phone: {user.phone}")
    print(f"  User Type: {user.user_type}")
except Exception as e:
    print(f"✗ User creation failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n" + "-" * 50)
print("Step 3: Testing API View")
print("-" * 50)

try:
    # Create a new test data with different email
    api_test_data = {
        'name': 'API Test User',
        'email': 'apitest456@example.com',
        'phone': '+1112223333',
        'password': 'apipassword123',
        'user_type': 'rescuer'
    }
    
    factory = APIRequestFactory()
    request = factory.post('/api/auth/signup', api_test_data, format='json')
    view = RegisterView.as_view()
    response = view(request)
    
    print(f"✓ API Response Status: {response.status_code}")
    if response.status_code == 201:
        print("✓ Signup via API: SUCCESS")
        print(f"  Response data: {response.data}")
    else:
        print(f"✗ Signup via API: FAILED")
        print(f"  Response: {response.data}")
except Exception as e:
    print(f"✗ API test failed: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 50)
print("TEST COMPLETE")
print("=" * 50)
