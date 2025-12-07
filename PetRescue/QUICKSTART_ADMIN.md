# Quick Start Guide - Admin Approval Workflow

## Step 1: Update Database (Optional)

If you have existing reports with 'pending' status, run the migration:

```bash
cd backend
python migrate_report_status.py
```

## Step 2: Create Admin User

Open Django shell:
```bash
python manage.py shell
```

Run this code:
```python
from apps.users.models import User

# Update existing user to admin
user = User.objects.get(email='your-email@example.com')
user.role = 'admin'
user.is_staff = True
user.save()
print(f"✓ {user.email} is now an admin")
exit()
```

## Step 3: Restart Backend (if running)

The backend server should automatically pick up the changes. If not:

```bash
# Stop server (Ctrl+C)
# Start again
python manage.py runserver
```

## Step 4: Test the Workflow

### As a Regular User:

1. **Submit a Pet Report:**
   - Go to "Report Lost Pet" page
   - Fill in details and upload images
   - Submit the form
   - Note: Report will have 'inactive' status

2. **Search for Your Report:**
   - Your report will NOT appear in public search
   - You can access it via "My Reports" or direct link

### As an Admin:

1. **Login as Admin:**
   - Use your admin credentials

2. **Access Admin Dashboard:**
   - Navigate to: `http://localhost:3000/admin-dashboard`

3. **Activate Reports:**
   - See list of all reports
   - Find reports with 'inactive' status
   - Click "✓ Activate Report" button
   - Report status changes to 'active'

4. **Manage Status:**
   - For active reports, use dropdown to change status
   - Options: inactive, active, pending, found, approved, rejected, adopted

### As Report Owner:

1. **View Your Active Report:**
   - Navigate to your report detail page
   - See "Mark Pet as Found" button

2. **Mark as Found:**
   - Click "✓ Mark Pet as Found"
   - Status updates to 'found'
   - Button disappears
   - Success message shown

## Verification

### Check Report Visibility:

1. **Inactive Reports:**
   - Not visible in public search
   - Visible in admin dashboard
   - Accessible via direct link

2. **Active Reports:**
   - Visible in public search
   - Visible to all users
   - Can be marked as found by owner

3. **Found Reports:**
   - Visible in public search
   - Marked as found in UI
   - Cannot be updated by owner anymore

## API Testing (Optional)

### Test with cURL:

**Mark as Found:**
```bash
curl -X POST http://localhost:8000/api/pets/report/YOUR_REPORT_ID/mark-found/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Admin Activate:**
```bash
curl -X POST http://localhost:8000/api/pets/admin/reports/YOUR_REPORT_ID/activate/ \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Admin Update Status:**
```bash
curl -X PUT http://localhost:8000/api/pets/admin/reports/YOUR_REPORT_ID/status/ \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "found"}'
```

## Troubleshooting

**Problem:** Can't access admin dashboard
- **Solution:** Make sure your user has `role='admin'` and `is_staff=True`

**Problem:** Reports not showing in search
- **Solution:** Admin must activate them first (change status from inactive to active)

**Problem:** "Mark as Found" button not working
- **Solution:** 
  - Check you're logged in
  - Verify you're the report owner
  - Check browser console for errors

**Problem:** Getting 403 Forbidden error
- **Solution:**
  - For admin endpoints: Verify your role is 'admin'
  - For mark-found: Verify you own the report

## Success Indicators

You'll know it's working when:

✓ New reports show 'inactive' status
✓ Inactive reports don't appear in public search
✓ Admin can see and activate reports
✓ Activated reports appear in public search
✓ Report owners can mark pets as found
✓ Admin dashboard shows statistics correctly

## Next Steps

1. Read `ADMIN_WORKFLOW_GUIDE.md` for detailed documentation
2. Review `IMPLEMENTATION_SUMMARY.md` for technical details
3. Test all workflows thoroughly
4. Create test users and reports for validation

## Support

If you encounter issues:
1. Check browser console for errors
2. Check Django server logs
3. Verify database connections
4. Review `ADMIN_WORKFLOW_GUIDE.md` troubleshooting section
