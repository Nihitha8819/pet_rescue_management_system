import os
import django
import sys

# Add backend to path
sys.path.insert(0, os.path.dirname(__file__))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'petrescue_backend.settings')
django.setup()

from apps.users.models import User

print("=" * 60)
print("Resetting Password for User")
print("=" * 60)

email = 'kalyandornadula@gmail.com'
new_password = 'Kalyan@123'

try:
    user = User.objects.get(email=email)
    print(f"\n✓ Found user: {user.name} ({user.email})")
    
    # Set the new password
    user.set_password(new_password)
    user.save()
    
    print(f"✓ Password reset to: {new_password}")
    
    # Verify the password works
    if user.check_password(new_password):
        print(f"✓ Password verification successful!")
    else:
        print(f"✗ Password verification failed!")
    
except User.DoesNotExist:
    print(f"\n✗ User with email {email} not found")
except Exception as e:
    print(f"\n✗ Error: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
