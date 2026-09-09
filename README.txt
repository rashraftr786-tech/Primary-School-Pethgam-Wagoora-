GPS Pethgam Wagoora ERP — Firebase Config Upgrade

Replace ONLY:
    firebase-config.js

Keep:
    admission.html
    general_admission_register.html
    all other ERP files

After replacing the file:
1. Reload General Admission Register.
2. Confirm the existing admission records are still visible.
3. Tap "☁ Sync Local → Firebase".
4. Report the exact success/error message.

Do not clear browser/site data and do not delete any records.

Note:
This config file is deliberately written for the existing Firebase Compat
SDK used by the ERP. The Firebase console snippet you supplied is the
modern modular SDK configuration; the configuration values are the same,
but the ERP needs the Compat-compatible initialization style.
