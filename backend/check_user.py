import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'petrescue_backend.settings')
django.setup()

from apps.users.models import User

# Check if email already exists
email = 'kalyandornadula@gmail.com'
try:
    user = User.objects.get(email=email)
    print(f"User already exists!")
    print(f"  _id: {user._id}")
    print(f"  name: {user.name}")
    print(f"  email: {user.email}")
    print(f"  phone: {user.phone}")
    print(f"  user_type: {user.user_type}")
    print("\nThis is why signup is failing - email already exists!")
    print("Try with a different email address.")
except User.DoesNotExist:
    print(f"No user found with email: {email}")
    print("You can signup with this email!")
except Exception as e:
    print(f"Error checking user: {e}")
