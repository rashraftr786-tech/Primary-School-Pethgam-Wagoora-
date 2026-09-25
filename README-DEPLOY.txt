GPS PETHGAM WAGOORA — CLOUD FUNCTIONS
=====================================

This functions folder contains the patched attendance backend.

Files:
- index.js      Patched Cloud Functions source
- package.json  Existing project dependencies/runtime

Project expected by the ERP:
- gps-pethgam-wagoora-portal

Install dependencies from this folder:
  npm install

Deploy from the Firebase project ROOT (the folder containing firebase.json):
  firebase use gps-pethgam-wagoora-portal
  firebase deploy --only functions

Or deploy only the attendance/geofence functions:
  firebase deploy --only functions:beginTeacherAttendancePasskeyRegistration,functions:finishTeacherAttendancePasskeyRegistration,functions:beginTeacherAttendanceVerification,functions:secureTeacherAttendance,functions:setTeacherAttendanceGeofence

Important:
- Keep this functions folder as the project's configured functions source directory.
- Do not expose service-account credentials in this folder.
- The functions use Firebase Admin SDK server-side.
- The patched geofence function authorizes active admins/HOIs through admins/{uid}, while preserving the existing custom-claims and linked-staff compatibility paths.
- The source keeps the existing WebAuthn/passkey and GPS/geofence attendance functions.

After deployment:
1. Open Institution Settings.
2. Save Attendance Security again.
3. If an error remains, check Firebase Functions logs for setTeacherAttendanceGeofence.
