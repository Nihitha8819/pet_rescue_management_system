"""
Migration script to update existing PetReport statuses to the new workflow.
This script updates all 'pending' reports to 'inactive' to require admin approval.
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'petrescue_backend.settings')
django.setup()

from apps.pets.models import PetReport

def migrate_statuses():
    print("Starting migration of PetReport statuses...")
    
    # Update all 'pending' reports to 'inactive' for admin approval
    pending_reports = PetReport.objects.filter(status='pending')
    count = pending_reports.count()
    
    if count > 0:
        print(f"Found {count} reports with 'pending' status")
        pending_reports.update(status='inactive')
        print(f"✓ Updated {count} reports to 'inactive' status")
    else:
        print("No pending reports found")
    
    # Display current status distribution
    print("\nCurrent status distribution:")
    for status_choice in PetReport.STATUS_CHOICES:
        status_code = status_choice[0]
        status_name = status_choice[1]
        count = PetReport.objects.filter(status=status_code).count()
        print(f"  {status_name}: {count}")
    
    print("\nMigration completed!")
    print("\nNote: New reports will be created with 'inactive' status by default.")
    print("Admins must activate them to make them visible to the public.")

if __name__ == '__main__':
    migrate_statuses()
