# GPS Pethgam Wagoora — Deep Cleanup & Firebase Repair

## Removed substitute modules
- `marksheet.html` — its useful A4/PDF/print functionality was merged into `results.html`; Results is now the single Results & Marksheet administration module.
- `child-profile.html` — duplicate student profile/portfolio interface; `student-profile.html` remains the admin master profile and `Student-Portal.html` is the student read-only profile.
- `staff.html` — duplicate staff management interface; `Staff-Management.html` is retained.
- `Staff-Personal-Dashboard-HOI-Geofence.html` — duplicate dashboard; the retained `Staff-Personal-Dashboard.html` already contains the geofence controls.

## Results & Marksheet repairs
- Standardized Results page to the new Firebase project configuration.
- Added administrator authentication gate.
- Removed editable Project ID/collection controls; `marksheets` is now fixed.
- Added direct individual PDF generation using html2pdf.
- Added controlled Print All function.
- Fixed single-result Firebase saving so the record is linked to the Student Master by `studentRecordId`.
- Results are also copied to `students/{studentRecordId}/results/{admissionNo}` for the Student Portal.
- Added `published: true` to published result records.
- Fixed an asynchronous batch-save closure issue.
- Removed duplicate result-building call.

## Authentication repairs
- Removed the old hard-coded administrator UID.
- Added `admins/{uid}` as the single administrator authority.
- Added first-admin bootstrap for the configured school administrator email.
- Repaired Admission and General Admission Register checks to use `admins`, not the obsolete `users` collection.
- Student accounts retain the secure chain `Auth UID -> studentAccounts/{uid} -> studentRecordId -> students/{studentRecordId}`.
- Added `studentLoginIndex` so a student can use either Student ID or Admission Number at login while the account keeps one canonical login ID.

## Student Communication
- Added `student-communication.html`.
- Supports all students, a whole class, or an individual student.
- Messages are stored under `students/{studentRecordId}/communications/{messageId}`.
- Added Student Portal Messages section and dashboard count.

## Security rules
- Firestore rules now use the `admins` collection instead of a hard-coded UID.
- Added secure student communication rules.
- Kept student-owned reads and admin-only writes.
- Added minimal login-alias read access without exposing student profile data.

## Repository repairs
- Fixed references to the old `new-new-logo.png`; all modules now use `new-logo.png`.
- Fixed the broken `school-lh.html` reference.
- Fixed broken staff-dashboard management link.
- Removed obsolete menu entries from `index.html`.
- Added Student Communication to the administration dashboard.
- Updated setup documentation to the new Firebase project.

## Verification performed
- All remaining HTML inline JavaScript blocks pass Node syntax checking.
- No remaining references to the old hard-coded administrator UID, old Firebase project, deleted substitute modules, or obsolete logo filename were found.
- All local HTML `href`/`src` references resolve to files present in the cleaned package.


## Cloudinary photograph update — 2026-09-10
- Configured Cloudinary Cloud Name `wknkeiqp` and unsigned preset `gps-pethgam-photos`.
- Added `cloudinary-upload.js` for browser-safe unsigned image uploads.
- Admission and General Admission Register now upload student photographs to Cloudinary.
- Results photograph workflow now uploads to Cloudinary, with local fallback if temporarily offline.
- Firebase Migration uploads existing Base64 student photographs to Cloudinary instead of Firebase Storage.
- Removed Firebase Storage SDK/dependencies from the active photograph/result workflows.
- Excel result backups remain local; they are not uploaded to Firebase Storage.
