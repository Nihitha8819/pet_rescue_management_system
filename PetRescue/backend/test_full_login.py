import os
import django
import sys
import json

# Add backend to path
sys.path.insert(0, os.path.dirname(__file__))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'petrescue_backend.settings')
django.setup()

from django.test import RequestFactory
from apps.users.views import LoginView

print("=" * 60)
print("Testing Full Login API")
print("=" * 60)

# Create request
factory = RequestFactory()
data = {
    'email': 'kalyandornadula@gmail.com',
    'password': 'Kalyan@123'
}

request = factory.post(
    '/api/auth/login',
    data=json.dumps(data),
    content_type='application/json'
)

try:
    view = LoginView.as_view()
    response = view(request)
    
    print(f"\n✓ Response Status: {response.status_code}")
    print(f"✓ Response Data: {response.data}")
    
except Exception as e:
    print(f"\n✗ Error: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
