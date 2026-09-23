Teacher Dashboard – Teacher Access Fix

The dashboard login check was aligned with the Common Login role detection.

It now accepts a staff record as Teacher when:
- role == TEACHER, or
- accessRole == TEACHER, or
- accessRole == STAFF and role/designation identifies the staff member as Teacher.

This fixes the case where Common Login identifies the account as TEACHER but the dashboard rejects it because accessRole is stored as STAFF.

No Firebase configuration or PIN/authentication flow was changed.
JavaScript syntax was checked successfully.

Replace the existing Teacher-Dashboard.html with the included file.
