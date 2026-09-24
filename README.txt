Cook Dashboard — Shared Firebase Config / Deep Fix

Included files:
- Cook-Dashboard.html
- firebase-config.js
- README.txt

Changes applied without changing Role-Login.html or login routing:
1. Removed duplicated Firebase config from the dashboard.
2. Dashboard now loads the shared firebase-config.js.
3. Rice Stock reads are strictly scoped to cookId == the logged-in staff document ID.
4. Monthly MDM Statement now reads only this Cook's riceStock records.
5. Existing MDM, rice entry, equipment, notices/calendar, attendance and leave workflows are preserved.
6. Firebase Auth restoration and Common Login session handling are preserved.

Important Firestore requirement:
- riceStock documents written by this dashboard contain cookId and cookAuthUid.
- Firestore Rules must independently enforce that a Cook can only read/write their own records.
- Do not rely on browser-side filters as the security boundary.

Deployment:
Keep Cook-Dashboard.html and firebase-config.js in the same directory. If your project already has an approved shared firebase-config.js, use that file instead of the included copy, provided it defines FIREBASE_CONFIG.
