# GPS Pethgam Wagoora ERP — Deep Audit & Refactoring Report
Date: 19 September 2026

## Scope
The supplied ZIP was extracted and all 44 archive files were inventoried. The source contains 30 HTML pages plus JavaScript/configuration, Firebase rules, documentation and an image asset. The execution directive requires a non-destructive inspect/map/audit/refactor/integrate/test/verify/package process; the package documentation likewise identifies a hybrid Firebase/LocalStorage architecture. fileciteturn0file0L82-L118

## Architecture
Core identities are:
- Administrator/HOI: Firebase Auth UID → `admins/{uid}`
- Student: Firebase Auth UID → `studentAccounts/{uid}` → `studentRecordId` → `students/{studentRecordId}`
- Staff: Employee ID → `staffLoginIndex/{employeeId}` → `staff/{staffId}` → Auth UID

Major Firestore collections found include `admins`, `staff`, `staffLoginIndex`, `teachingAssignments`, `staffAttendance`, `staffLeaves`, `aayaDuties`, `mdmDaily`, `riceStock`, `institution`, `students`, `studentAccounts`, `studentLoginIndex`, `marksheets`, `results`, `notices`, `calendar`, `timetables`, `homework`, `assignments`, `teacherMessages`, `communications`, `attendance`, `libraryBooks`, and `libraryTransactions`.

## Top 10 critical modules
1. `Role-Login.html` — role authentication and routing — Critical
2. `Staff-Management.html` — staff identity/permissions/assignments — Critical
3. `general_admission_register.html` — student master — Critical
4. `Student-Account-Setup.html` — student Auth linkage — Critical
5. `Student-Portal.html` — student-facing integration — Critical
6. `results.html` — result persistence/marksheet generation — Critical
7. `Staff-Personal-Dashboard-Tr.html` — teacher workflow — High
8. `index.html` — administrative entry/dashboard — High
9. `Aaya-Dashboard.html` / `Cook-Dashboard.html` — staff role workflows — High
10. `firebase-config.js` / `firestore.rules` — shared configuration/security — Critical

## Duplication and legacy
The supplied cleanup documentation records previous consolidation of duplicate modules such as `marksheet.html`, `child-profile.html`, `staff.html`, and the duplicate HOI geofence dashboard. Those files were not reintroduced. Firebase initialization and authorization checks remain repeated across pages; this was not blindly removed because pages are independently deployable HTML modules.

## Firebase audit
The original archive used four Firebase SDK versions: 10.12.5, 10.14.1, 11.10.0 and 12.1.0. The refactored package normalizes HTML Firebase references to 10.14.1.

Student photographs remain on the documented Cloudinary workflow. A reusable Firebase Storage attachment engine was added separately for documents and leave attachments.

## New integrated workflows
### Student Leave
`Student-Leave.html`:
Authentication → student account → master student record → validation → optional Firebase Storage attachment → `studentLeaves` Firestore record → status/history display.

### Admin/HOI Leave
`Leave-Management.html`:
Administrator/HOI authorization → application list → Approve / Reject / Modification Required → remarks → `auditHistory`.

### HOI documentation
`HOI-Applications.html`:
Authorized administrator/HOI → application details → optional Storage attachment → `officialApplications` Firestore record.

### Universal attachment engine
`attachment-engine.js` supports PDF, JPG/JPEG, PNG and WebP, validates MIME/extension/size, requires authentication, reports progress, and stores metadata while binary content resides in Firebase Storage.

## Security
The rules were extended for the new workflows and the administrator helper recognizes both `admin` and `hoi`. Storage is deny-by-default outside explicit paths.

Important compatibility limitation: the legacy rules permit broad reads for some authenticated users, including the existing student/shared collections. A complete least-privilege rewrite would require a full teacher/staff claim or role-document migration and query-by-query validation; changing it blindly could break existing dashboards. This package therefore records the issue rather than pretending it has been safely solved.

## Static validation
All inline JavaScript blocks in the original HTML pages passed Node syntax checking. Local reference analysis found no confident missing static asset after excluding dynamic template strings. Firebase SDK references were normalized.

## Not verified without live deployment
The following cannot honestly be certified from the archive alone:
- live Firebase Auth
- deployed Firestore/Storage rules
- real Storage uploads/downloads
- cross-device real-time listeners
- Firebase indexes
- Cloudinary production uploads
- complete browser console/network behavior
- end-to-end workflows against the live project

## Deployment verification checklist
1. Deploy `firestore.rules` and `storage.rules`.
2. Ensure Firebase Storage is enabled for the new attachment workflows.
3. Test Admin/HOI login.
4. Submit student leave with and without attachment.
5. Approve, reject and request modification.
6. Confirm student status changes.
7. Create HOI application and verify attachment.
8. Test Teacher/Aaya/Cook login.
9. Test Student Portal results/profile/attendance.
10. Inspect browser console and Firebase logs.

The package is therefore an audited/refactored build with explicit live-testing limitations, rather than an unverified claim of production completion.
