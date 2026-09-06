# GPS Pethgam Wagoora — Free-Only Student Portal Setup

## 1. Firebase
Use the existing Firebase project `pry-school-pethgam-wagoora`.

1. Enable Email/Password in Firebase Authentication.
2. Create/keep the administrator Authentication account.
3. Keep `admins/{ADMIN_UID}` with `active: true` and `role: "admin"`.
4. Publish `firestore.rules`.
5. If you continue using Firebase Storage, publish `storage.rules`; however this Free-only build does **not** depend on Firebase Storage for profile photos.

Firebase's Spark plan provides no-cost quotas for Authentication and Firestore; exceeding a Spark quota can shut that product off for the remainder of the billing cycle rather than automatically charging you. See Firebase's current pricing documentation.

## 2. Student accounts
Open `Student-Account-Setup.html` as the administrator.

- Enter the admin Firebase email/password.
- Enter Student ID, Admission Number and student details.
- A Firebase Authentication account is created with a synthetic internal email derived from the Student ID.
- The page generates a temporary random password.
- The password is shown once and is not stored in Firestore.
- The student signs in through `Student-Portal.html` using Student ID/Admission Number + password.

## 3. Cloudinary profile photos (optional)
Firebase Storage is deliberately not required for this Free-only design. Cloudinary's Free plan currently supports browser uploads and has a monthly credit allowance.

Create a Cloudinary unsigned upload preset and then replace the two placeholders in `firebase-config.js`:

- `cloudName`
- `uploadPreset`

Only use this for ordinary profile photographs. Do **not** upload Aadhaar scans, birth certificates, medical records or other sensitive documents to a public image host.

## 4. Firestore student structure
Each student account uses:

`students/{firebaseAuthUid}`

with subcollections:

- `attendance`
- `results`
- `library`
- `documents`

The portal also reads:

- `marksheets/{admissionNo}`
- `notices/{docId}`
- `calendar/{docId}`
- `timetables/{docId}`

## 5. Important migration note
The existing school modules in this repository still contain localStorage-based workflows. This build introduces the secure Firebase student portal without silently deleting those existing local records. The next migration step is to make the admin modules write the same Firestore records consumed by the portal.

## 6. Do not publish Firebase Storage as a requirement
The portal itself uses Firestore + Firebase Authentication and optional Cloudinary profile-photo URLs. No Firebase Storage upload is required for the student portal.
