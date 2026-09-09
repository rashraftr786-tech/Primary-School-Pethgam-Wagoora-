REPLACE ONLY firebase-config.js

This corrected version fixes the global configuration-name mismatch:
the Phase 2 ERP pages expect window.GPS_FIREBASE_CONFIG.

After replacing:
1. Reload General Admission Register.
2. Confirm the admission records are still visible.
3. Tap "☁ Sync Local → Firebase".
4. Report the exact message shown.

Do not clear Chrome/site data or delete admission records.
