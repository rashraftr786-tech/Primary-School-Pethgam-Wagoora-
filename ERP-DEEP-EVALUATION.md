# GPS Pethgam Wagoora ERP — Deep Evaluation

## Inspected scope
The uploaded ZIP contains 37 files. The review covered every HTML/JS/config/rules file for module links, authentication, Firestore collections, LocalStorage use, teacher permissions, staff attendance, student portal data paths, PM-POSHAN/MDM workflow and the visual structure.

## Existing module map
**Students & Records:** General Admission Register, Admission Form, Student Profile, Promotion, Student Documents.

**Attendance/Welfare:** Student Attendance, Staff Attendance & Leave, Staff Attendance Timing Settings, PM-POSHAN/MDM, Work & Behaviour.

**Academic:** Results & Marksheet, Timetable, School Calendar, Notices & Circulars, Student Communication, Teacher Personal Dashboard.

**Administration:** Staff Management, Staff Personal Dashboard, Inventory, Library, Salary Increment, certificate generators, Student Account Setup, Firebase Migration.

**Student Portal:** Dashboard, attendance, homework/assignments, notices/circulars, messages, calendar, marksheet/profile and password change.

## Major findings
1. The architecture is hybrid: Firebase is used by the core student/staff/teacher flows, while several modules remain LocalStorage based. MDM in particular is a browser-local monthly MDCF.
2. Staff login already uses Employee ID + PIN through `staffLoginIndex`, then Firebase Authentication and `staff/{staffId}.authUid` verification.
3. Teacher permissions are already represented on staff records.
4. The uploaded config/rules used `rashraftr786@gmail.com` as bootstrap admin while the dashboard code used `pspathgam@gmail.com`. This has been corrected in the role-aware package to `pspathgam@gmail.com`.
5. The original Firestore rules did not include several collections actually used by staff/teacher dashboards. The package includes expanded role-aware rules for staff attendance, leave, Aaya duty, daily MDM, staff login index, homework, teacher messages and related reads.
6. `index.html` referenced `Staff-Personal-Dashboard.html`, but the ZIP contains `Staff-Personal-Dashboard-Tr.html`; the package fixes this broken link.
7. Staff Management had `Teacher/Staff` and `HOI` Access Role values even though the designation field mentioned Aaya/Cook. The package adds explicit Aaya and Cook values.

## New common login
`Role-Login.html` provides four role selectors: **HOI, Admin/Teacher, Aaya, Cook**. HOI uses email/password. Staff roles use Employee ID + PIN. The Forgot Password/PIN tab resolves the registered Firebase email and sends a Firebase password reset email.

## Aaya dashboard
`Aaya-Dashboard.html` includes profile, attendance check-in/check-out, leave application/history, notices, school calendar access, a daily duty/support log and mobile bottom navigation. Daily duty records use `aayaDuties`.

## Cook dashboard
`Cook-Dashboard.html` includes profile, attendance, daily Bal Vatika/Primary meal counts, remarks, rice opening/received/consumed/closing note, leave application/history, notices and direct access to the existing official `MDM.html` monthly MDCF. Daily operational meal/stock records use `mdmDaily`; the existing MDM form remains the official monthly record.

## Design
The new pages follow the supplied reference style: purple curved header, circular logo, welcome block, rounded white icon cards, soft grey background, notification-style panels and Android-friendly bottom navigation.

## Added/changed files
- `Role-Login.html`
- `Aaya-Dashboard.html`
- `Cook-Dashboard.html`
- `role-dashboard.css`
- `Staff-Attendence-Settings-Admin.html` compatibility alias
- `index.html` broken-link correction + Role Login entry
- `Staff-Management.html` Aaya/Cook Access Roles
- `firebase-config.js` bootstrap admin correction
- `firestore.rules` role-aware rules
