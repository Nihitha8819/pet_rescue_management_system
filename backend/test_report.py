import os
import sys
import django
from io import BytesIO

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'petrescue_backend.settings')
django.setup()

from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIRequestFactory, force_authenticate
from apps.pets.views import PetReportCreateView
from apps.users.models import User

print("=" * 60)
print("Testing Pet Report Submission")
print("=" * 60)

# Get the existing user
try:
    user = User.objects.get(email='kalyandornadula@gmail.com')
    print(f"\n✓ Found user: {user.name} (ID: {user._id})")
except User.DoesNotExist:
    print("\n✗ User not found! Please login first.")
    sys.exit(1)

# Create test data
test_data = {
    'pet_name': 'Test Bunny',
    'pet_type': 'dog',
    'description': 'Black dog found near park',
    'location_found': 'venkatagiri',
    'contact_info': '9492691370',
}

print(f"\nTest Data:")
for key, value in test_data.items():
    print(f"  {key}: {value}")

# Create fake image file
fake_image = SimpleUploadedFile(
    "test_image.jpg",
    b"fake image content",
    content_type="image/jpeg"
)

print("\n" + "-" * 60)
print("Testing Pet Report API")
print("-" * 60)

try:
    factory = APIRequestFactory()
    
    # Create the request with both data and file
    request_data = test_data.copy()
    request = factory.post(
        '/api/pets/report/create/',
        data=request_data,
        format='multipart'
    )
    
    # Add the image file
    request.FILES['images[0]'] = fake_image
    
    # Authenticate the request
    force_authenticate(request, user=user)
    
    # Call the view
    view = PetReportCreateView.as_view()
    response = view(request)
    
    print(f"\n✓ Response Status: {response.status_code}")
    
    if response.status_code == 201:
        print("✓ Pet Report Created Successfully!")
        print(f"  Response: {response.data}")
    else:
        print(f"✗ Failed to create pet report")
        print(f"  Response: {response.data}")
        
except Exception as e:
    print(f"\n✗ Error: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
print("TEST COMPLETE")
print("=" * 60)
