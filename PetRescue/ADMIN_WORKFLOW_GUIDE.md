# Pet Reporting System - Admin Approval Workflow

## Overview

This document describes the new admin approval workflow and status management features added to the Pet Reporting System.

## Features

### 1. User Role Management

**User Model Updates:**
- Added `role` field with choices: `user` or `admin`
- Default role: `user`
- Existing field in the model is now actively used for authorization

### 2. Pet Report Status Workflow

**New Status Options:**
- `inactive` - Report submitted but not yet approved by admin (default for new reports)
- `active` - Report approved by admin and visible to public
- `pending` - Report in pending state (for other workflow needs)
- `found` - Pet has been found (marked by report owner)
- `approved` - Report approved (legacy status)
- `rejected` - Report rejected (legacy status)
- `adopted` - Pet has been adopted (future use)

**Status Flow:**
```
User submits report → inactive → (Admin activates) → active → (User marks) → found
```

### 3. API Endpoints

#### User Endpoints

**Mark Pet as Found:**
```
POST /api/pets/report/{reportId}/mark-found/
Authorization: Bearer {token}

Response: Updated PetReport object
```
- Only the report owner can mark their pet as found
- Changes status from any state to `found`

#### Admin Endpoints

**Activate Report:**
```
POST /api/pets/admin/reports/{reportId}/activate/
Authorization: Bearer {token}

Response: Updated PetReport object with status='active'
```
- Only admins can activate reports
- Changes status from `inactive` to `active`
- Makes report visible to the public

**Update Report Status:**
```
PUT /api/pets/admin/reports/{reportId}/status/
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "status": "active|inactive|pending|found|approved|rejected|adopted"
}

Response: Updated PetReport object
```
- Only admins can use this endpoint
- Can change report status to any valid value
- Validates status against PetReport.STATUS_CHOICES

### 4. Frontend Components

#### Pet Detail Page (`PetReportDetail.jsx`)

**For Report Owners:**
- Displays "Mark Pet as Found" button
- Button only visible if report status is not already `found`
- Uses new `/mark-found/` endpoint
- Shows success message after status update

**Status Display:**
- Color-coded status badges:
  - `inactive`: Gray
  - `active`: Blue
  - `pending`: Yellow
  - `found`: Green

#### Admin Dashboard (`AdminDashboard.jsx`)

**Features:**
- View all pet reports regardless of status
- Statistics cards showing:
  - Total Reports
  - Inactive (Pending Approval)
  - Active Reports
  - Found Pets
- For `inactive` reports: "✓ Activate Report" button
- For other reports: Dropdown to change status to any value
- Real-time status updates
- Image display for reports with uploaded photos

**Access Control:**
- Only users with `role='admin'` or `is_staff=True` can access
- Non-admin users see permission denied message

### 5. Visibility Rules

**Public Pet Report List (`/api/pets/reports/`):**
- Unauthenticated users: Only see `active` reports
- Regular users: Only see `active` reports
- Admins: See all reports (all statuses)

**Report Detail Page:**
- Anyone can view individual report details if they have the ID
- But only `active` reports appear in search results

## Database Migration

To update existing reports in your database, run the migration script:

```bash
cd backend
python migrate_report_status.py
```

This script will:
- Update all `pending` reports to `inactive` status
- Display the current status distribution
- Preserve reports that are already in other states

## Setup Instructions

### Backend Setup

1. **Models are already updated** - No migration files needed (using MongoDB with djongo)

2. **Update existing data:**
   ```bash
   cd backend
   python migrate_report_status.py
   ```

3. **Create an admin user** (if you don't have one):
   ```bash
   python manage.py shell
   ```
   ```python
   from apps.users.models import User
   
   # Update existing user to admin
   user = User.objects.get(email='your-email@example.com')
   user.role = 'admin'
   user.is_staff = True
   user.save()
   
   # Or create new admin
   User.objects.create_user(
       email='admin@example.com',
       password='your-password',
       name='Admin User',
       role='admin',
       is_staff=True,
       user_type='admin'
   )
   ```

4. **Restart the Django server:**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

No additional setup needed. The frontend components have been updated to use the new endpoints.

## Testing

### Test User Workflow

1. **Submit a Pet Report** as a regular user
   - Report will be created with status `inactive`
   - Report will NOT appear in public search results

2. **Login as Admin**
   - Navigate to `/admin-dashboard`
   - See the inactive report in the list
   - Click "✓ Activate Report"
   - Report status changes to `active`

3. **Public Search**
   - Report now appears in search results
   - Non-logged-in users can see it

4. **Mark as Found** (as report owner)
   - Navigate to the report detail page
   - Click "✓ Mark Pet as Found"
   - Status changes to `found`

### Test Admin Workflow

1. **Login as Admin**
2. **Go to Admin Dashboard**
3. **View Statistics:**
   - Total reports
   - Inactive (pending approval)
   - Active
   - Found

4. **Manage Reports:**
   - Activate inactive reports
   - Change any report status using dropdown
   - View report images and details

## API Response Examples

### Mark as Found

**Request:**
```bash
curl -X POST http://localhost:8000/api/pets/report/675420c9743d22f598a/mark-found/ \
  -H "Authorization: Bearer {your_token}"
```

**Response:**
```json
{
  "_id": "675420c9743d22f598a",
  "pet_name": "Fluffy",
  "pet_type": "cat",
  "description": "Found near park",
  "location_found": "Central Park",
  "contact_info": "555-1234",
  "images": ["/media/pet_reports/user_fluffy_0_image.png"],
  "status": "found",
  "created_at": "2024-12-07T10:30:00Z",
  "updated_at": "2024-12-07T14:15:00Z"
}
```

### Admin Activate Report

**Request:**
```bash
curl -X POST http://localhost:8000/api/pets/admin/reports/675420c9743d22f598a/activate/ \
  -H "Authorization: Bearer {admin_token}"
```

**Response:**
```json
{
  "_id": "675420c9743d22f598a",
  "pet_name": "Buddy",
  "status": "active",
  ...
}
```

### Admin Update Status

**Request:**
```bash
curl -X PUT http://localhost:8000/api/pets/admin/reports/675420c9743d22f598a/status/ \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{"status": "found"}'
```

**Response:**
```json
{
  "_id": "675420c9743d22f598a",
  "pet_name": "Buddy",
  "status": "found",
  ...
}
```

## Security Considerations

1. **Authentication Required:**
   - Mark as found: Must be authenticated AND be the report owner
   - Admin endpoints: Must be authenticated AND have admin role

2. **Authorization Checks:**
   - Backend validates user role before allowing admin operations
   - Frontend hides admin features from non-admin users
   - API returns 403 Forbidden for unauthorized access

3. **Data Validation:**
   - Status values validated against STATUS_CHOICES
   - Invalid status returns 400 Bad Request
   - Report IDs validated (404 if not found)

## Troubleshooting

### Reports Not Showing in Search

**Issue:** Newly created reports don't appear in search results.

**Solution:** Reports must be activated by an admin first. Check:
1. Is the report status `inactive`?
2. Has an admin activated it?
3. Login as admin and activate the report

### "Mark as Found" Button Not Working

**Issue:** Clicking the button shows an error.

**Solution:** Check:
1. Are you logged in?
2. Are you the owner of the report?
3. Is your auth token valid? (Try logging out and in again)
4. Check browser console for error details

### Admin Dashboard Not Accessible

**Issue:** Getting "You do not have permission" message.

**Solution:** Check:
1. Is your user's `role` field set to `'admin'`?
2. Is `is_staff` set to `True`?
3. Update in Django shell or database

## Future Enhancements

Potential features for future development:

1. **Email Notifications:**
   - Notify user when report is activated
   - Notify admin when new report submitted

2. **Bulk Operations:**
   - Activate multiple reports at once
   - Batch status updates

3. **Report Comments:**
   - Admin can leave comments on reports
   - User can respond to admin questions

4. **Advanced Filtering:**
   - Filter admin dashboard by status, date, pet type
   - Search reports by keyword

5. **Analytics:**
   - Reports submitted per day/week/month
   - Average time to activation
   - Most common pet types reported
