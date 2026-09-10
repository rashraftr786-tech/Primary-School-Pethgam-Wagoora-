# GPS Pethgam Wagoora — Integrated Firebase Repair

## What changed
- Student account chain: Auth UID -> studentAccounts/{UID} -> studentRecordId -> students/{studentRecordId}.
- Student photographs: Cloudinary (`wknkeiqp`, unsigned preset `gps-pethgam-photos`) + `photoUrl`/`photoPublicId` in Student Master. Firebase Storage is intentionally not used.
- Results: marksheets now store `studentRecordId` when it can be resolved by admission number.
- Attendance: local attendance is retained and synced to `students/{studentRecordId}/attendance/{date}`.
- Notices, calendar and timetable: local data is retained and synced to top-level Firestore collections.
- Library: books/transactions can sync; matched student transactions are copied to `students/{studentRecordId}/library`.
- Added `Firebase-Migration.html` for one-time migration of existing localStorage data.
- Added `firestore.rules` and `storage.rules`.

## Deployment
1. Replace the matching HTML files in the GitHub repository with this folder's files.
2. Deploy `firestore.rules` to Firebase Firestore Rules.
3. Firebase Storage is not required for this build. Student photographs use Cloudinary; `storage.rules` may be retained as a deny-by-default safety file if the Firebase project ever enables Storage.
4. Sign in to the school admin account, open `Firebase-Migration.html`, and run the migration once.
5. Open `Student-Account-Setup.html`, verify/recreate only accounts that need linkage. Existing accounts should work if their `studentRecordId` is correct.
6. Test a student login.

The localStorage modules remain usable offline. Cloud writes require an authenticated school administrator.
