import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'petrescue_backend.settings')
django.setup()

from apps.users.models import User
from apps.pets.models import PetReport

print('=== EXISTING USERS ===')
users = User.objects.all()
for u in users:
    print(f'Email: {u.email}, Role: {u.role}, Staff: {u.is_staff}')

print('\n=== CREATING/UPDATING ADMIN ===')
admin = User.objects.filter(email='admin@petrescue.com').first()
if not admin:
    admin = User.objects.create_user(
        email='admin@petrescue.com',
        password='admin123',
        name='Admin User',
        user_type='admin',
        role='admin'
    )
    admin.is_staff = True
    admin.is_verified = True
    admin.save()
    print(f'✓ Created admin: {admin.email}')
else:
    admin.role = 'admin'
    admin.is_staff = True
    admin.is_verified = True
    admin.save()
    print(f'✓ Updated existing user to admin: {admin.email}')

print('\n=== ADMIN LOGIN CREDENTIALS ===')
print('Email: admin@petrescue.com')
print('Password: admin123')
print('Role: admin')

print('\n=== PET REPORTS STATUS ===')
reports = PetReport.objects.all()
print(f'Total Reports: {reports.count()}')
for r in reports:
    print(f'- {r.pet_name}: {r.status}')

print('\n✓ Admin account ready!')
print('Login at: http://localhost:3000/login')
print('Admin Dashboard: http://localhost:3000/admin-dashboard')
