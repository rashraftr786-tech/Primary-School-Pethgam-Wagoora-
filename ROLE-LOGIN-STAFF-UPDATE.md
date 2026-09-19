# Role Login + Staff Management Update

## Teacher login issue fixed
The previous common Role-Login stored a successful teacher login only in `GPSPETHGAM_ROLE_SESSION_V1`, while the existing `Staff-Personal-Dashboard-Tr.html` expected `GPSPETHGAM_STAFF_SESSION_V2`. As a result, Firebase authentication could succeed but the teacher dashboard would not restore the authenticated teacher session.

The common login now writes both session formats for Teacher accounts, and the teacher dashboard also understands the common role session.

Additional safeguards:
- Explicit `accessRole` is checked before designation text.
- Existing legacy `Staff` access roles continue to work as Teacher.
- Employee ID lookup tries exact, uppercase and lowercase variants.
- Inactive or login-disabled staff are rejected.

## Staff Management
- Access Role selector: Admin / HOI, Teacher, Aaya, Cook.
- Qualification selector: Middle Pass, Matric Pass, 12th Pass, Graduate, Post Graduate, D.Ed, B.Ed, M.Ed.
- Stream selector: Science, Arts.
- Subject in P.G. field.
- Multiple class-wise teaching assignments, e.g. 5th — English; 4th — Mathematics.
- Assignments are stored on the staff record and also in `teachingAssignments/{staffId}`.

## Timetable
- Added Sync Staff Assignments control.
- Active teachers and their class-wise subject assignments can be imported into the timetable.
- Teacher-specific class and subject selectors are populated from Staff Management assignments.
- Existing saved timetable periods are preserved when teachers are synchronized.
- Manual timetable period/day/room controls remain intact.
