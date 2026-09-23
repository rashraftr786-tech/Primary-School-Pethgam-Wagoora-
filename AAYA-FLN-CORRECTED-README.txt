AAYA FLN CORRECTED INSTALL

Use the existing Common Login page that is already working for Aaya. Replace only Aaya-Dashboard.html with the supplied file.

This dashboard NEVER calls signInWithEmailAndPassword and never expects an email. It uses the authenticated Firebase session created by the Common Login page.

The previous auth/invalid-email message comes from the login page when Firebase receives a malformed email value from staffLoginIndex; it is not an FLN dashboard operation. This corrected dashboard also no longer auto-redirects after an error, so the actual dashboard error remains visible instead of producing a login loop.

No PIN/password is changed. No staff account is recreated.
