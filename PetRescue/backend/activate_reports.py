import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'petrescue_backend.settings')
django.setup()

from apps.pets.models import PetReport

print('=== UPDATING REPORTS TO ACTIVE STATUS ===')

# Update all found/pending reports to active so they show in search
reports = PetReport.objects.all()
for report in reports:
    if report.status in ['found', 'pending']:
        report.status = 'active'
        report.save()
        print(f'✓ Updated {report.pet_name} from {report.status} to active')

print('\n=== CURRENT PET REPORTS ===')
all_reports = PetReport.objects.all()
for r in all_reports:
    print(f'- {r.pet_name}: {r.status} (Type: {r.pet_type})')

print(f'\nTotal Reports: {all_reports.count()}')
print('✓ All reports now active and visible in search!')
