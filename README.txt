AAYA SCERT FLN FINAL PACKAGE

Base: SCERT J&K FLN Aaya Dashboard (corrected authentication/session version).

Changes requested:
- Added staff photo/profile placeholder without removing FLN modules.
- Preserved all FLN sections, daily checklist, incidents, history, attendance, leave and Aaya duties.
- School Notices/Circulars and School Calendar are view-only for Aaya.
- Added dedicated Aaya-Notices.html and Aaya-Calendar.html read-only pages.
- Existing Common Login is not changed.

Upload these three HTML files together. Replace the existing Aaya-Dashboard.html with this package version and keep the existing working Common Login.

The included firestore.rules is the FLN-compatible rules file from the earlier FLN package; review/deploy it only if your current rules do not already include the aayaDailyLogs/aayaIncidentReports permissions.
