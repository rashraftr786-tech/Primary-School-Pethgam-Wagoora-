# Firebase Student Portal — setup

## Important
The repository is currently configured for the Firebase project in `firebase-config.js` (`home-assignment-portal`). The config file is the source of truth. Do not mix credentials from another Firebase project.

## Fix the “not an active school admin” error
1. In Firebase Authentication, ensure `rashraftr786@gmail.com` exists and Email/Password is enabled.
2. Deploy `firestore.rules` from this repository.
3. Open `Student-Account-Setup.html`.
4. Sign in with `rashraftr786@gmail.com`. The first successful sign-in for the approved email bootstraps `admins/{UID}` with `active: true` and `role: admin`.
5. After that, the normal admin check is used.

## Student accounts
Student Account Setup loads the real records from `GPSPETHGAM_MASTER_ADMISSION_V1` in the administrator’s browser. Select an existing non-rejected student, enter a temporary password, and create the Firebase account. No sample student is included.

The Firebase account uses an internal email derived from Student ID; students continue to enter only Student ID/Admission Number + password in the Student Portal.

## Student privacy
The portal reads only the signed-in student’s `students/{UID}` document and their own subcollections. The master admission register is not shipped to the student portal. Firestore rules must be deployed for this privacy boundary to be enforced.

## Current data architecture
The older administrative modules in this repository still use browser `localStorage` for attendance, results, library, timetable, notices and calendar. The new Firebase student portal is ready to consume Firebase records for these modules, but those modules must be migrated/synchronized to Firestore before their data becomes available across devices.
