HOI Dashboard Login Fix

Problem fixed:
The old HOI dashboard checked auth.currentUser immediately. Firebase Auth may still be restoring the persisted session after page navigation, so auth.currentUser was temporarily null and the dashboard redirected back to Role-Login.html, appearing as an empty login form.

Fix:
- Waits for Firebase onAuthStateChanged before deciding that the user is logged out.
- Uses LOCAL Firebase Auth persistence.
- Verifies admins/{uid} after the authenticated user is restored.
- Accepts admin/hoi/head of institution role values.
- Preserves the common ADMIN session.
- Keeps the original HOI approval queues and actions.

Replace the existing HOI-Dashboard.html with the supplied HOI-Dashboard.html. Keep firebase-config.js in the same folder.
