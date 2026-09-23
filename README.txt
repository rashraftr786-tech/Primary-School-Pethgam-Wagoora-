SCHOOL ERP — AAYA / COOK SESSION FIX

The pasted login page authenticated Aaya/Cook correctly but saved the staff
session only under GPSPETHGAM_ROLE_SESSION_V1.

The Aaya and Cook dashboards were reading GPSPETHGAM_COMMON_LOGIN_SESSION_V1.
Therefore authentication succeeded, the dashboard opened, and then it rejected
the session as invalid.

This package fixes the mismatch in two ways:
1. Role-Login.html now saves BOTH session formats.
2. Aaya-Dashboard.html and Cook-Dashboard.html accept either format.

No Firebase password/PIN is changed.

UPLOAD THESE THREE FILES:
- Role-Login.html
- Aaya-Dashboard.html
- Cook-Dashboard.html

Keep your existing Teacher dashboard.

After uploading, hard-refresh the GitHub Pages site and test Aaya and Cook.
