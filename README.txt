Teacher Dashboard – Teacher Access Fix v2

The previous version still contained strict accessRole === TEACHER checks.
This version fixes all Teacher access checks in the dashboard.

Teacher is accepted when the staff record has:
- role = TEACHER, OR
- accessRole = TEACHER, OR
- designation / roleDesignation = TEACHER, including the common pattern
  accessRole = STAFF + designation = Teacher.

The same check is used during:
- login
- session restoration
- live staff profile listener

Common Login and Firebase authentication are not changed.
