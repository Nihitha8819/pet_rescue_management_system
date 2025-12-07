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
print("Finding Duplicate Users")
print("=" * 60)

email = 'kalyandornadula@gmail.com'

users = User.objects.filter(email=email)
print(f"\nFound {users.count()} users with email: {email}")

for i, user in enumerate(users, 1):
    print(f"\nUser {i}:")
    print(f"  ID: {user._id}")
    print(f"  Name: {user.name}")
    print(f"  Email: {user.email}")
    print(f"  User Type: {user.user_type}")

print("\n" + "-" * 60)
print("Keeping the FIRST user, deleting duplicates...")
print("-" * 60)

# Keep first, delete rest
first_user = users.first()
duplicates = users.exclude(_id=first_user._id)

print(f"\nKeeping: {first_user.name} (ID: {first_user._id})")
print(f"Deleting {duplicates.count()} duplicate(s)...")

for dup in duplicates:
    print(f"  Deleting: {dup._id}")
    dup.delete()

print("\n✓ Cleanup complete!")
print("\nVerifying...")
remaining = User.objects.filter(email=email).count()
print(f"Users with {email}: {remaining}")

print("\n" + "=" * 60)
