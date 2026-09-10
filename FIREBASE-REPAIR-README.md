# GPS Pethgam Wagoora — Integrated Firebase Repair

## What changed
- Student account chain: Auth UID -> studentAccounts/{UID} -> studentRecordId -> students/{studentRecordId}.
- Student photographs: Firebase Storage (`student-photos/...`) + `photoUrl` in Student Master; local Base64 remains only as a browser backup.
- Results: marksheets now store `studentRecordId` when it can be resolved by admission number.
- Attendance: local attendance is retained and synced to `students/{studentRecordId}/attendance/{date}`.
- Notices, calendar and timetable: local data is retained and synced to top-level Firestore collections.
- Library: books/transactions can sync; matched student transactions are copied to `students/{studentRecordId}/library`.
- Added `Firebase-Migration.html` for one-time migration of existing localStorage data.
- Added `firestore.rules` and `storage.rules`.

## Deployment
1. Replace the matching HTML files in the GitHub repository with this folder's files.
2. Deploy `firestore.rules` to Firebase Firestore Rules.
3. Deploy `storage.rules` to Firebase Storage Rules and make sure Firebase Storage is enabled.
4. Sign in to the school admin account, open `Firebase-Migration.html`, and run the migration once.
5. Open `Student-Account-Setup.html`, verify/recreate only accounts that need linkage. Existing accounts should work if their `studentRecordId` is correct.
6. Test a student login.

The localStorage modules remain usable offline. Cloud writes require an authenticated school administrator.
