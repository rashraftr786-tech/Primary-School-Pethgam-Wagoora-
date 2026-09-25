const { onCall, HttpsError } = require('firebase-functions/https');
const { logger } = require('firebase-functions');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} = require('@simplewebauthn/server');

initializeApp();
const db = getFirestore();

// Change these only if the public ERP domain changes.
const RP_NAME = process.env.ATTENDANCE_RP_NAME || 'Government Primary School Pethgam Wagoora';
const RP_ID = process.env.ATTENDANCE_RP_ID || '86-tech.github.io';
const ORIGIN = process.env.ATTENDANCE_ORIGIN || 'https://86-tech.github.io';
const CHALLENGE_TTL_MS = 5 * 60 * 1000;

function requireAuth(request) {
  if (!request.auth?.uid) throw new HttpsError('unauthenticated', 'Firebase authentication is required.');
  return request.auth.uid;
}

async function getLinkedStaff(uid) {
  const snap = await db.collection('staff').where('authUid', '==', uid).limit(1).get();
  if (snap.empty) throw new HttpsError('permission-denied', 'No staff record is linked to this Firebase account.');
  const doc = snap.docs[0];
  const staff = doc.data() || {};
  if (String(staff.status || 'Active').toLowerCase() === 'inactive' || staff.loginEnabled === false) {
    throw new HttpsError('permission-denied', 'This staff account is inactive or login is disabled.');
  }
  return { id: doc.id, data: staff };
}

// Administrative authorization for the ERP's existing admins/{uid} model.
// The dashboard authenticates administrators through the admins collection,
// so attendance administration must honor the same source of truth.
async function requireSchoolAdmin(request) {
  const uid = requireAuth(request);
  const token = request.auth?.token || {};
  const tokenRole = String(token.role || token.accessRole || '').trim().toUpperCase();

  // Preserve support for deployments that already use custom admin claims.
  const claimAllowed = token.admin === true ||
    token.schoolAdmin === true ||
    ['ADMIN', 'SCHOOL_ADMIN', 'HOI', 'HEAD_OF_INSTITUTION'].includes(tokenRole);
  if (claimAllowed) return { uid, source: 'custom-claims' };

  // Primary ERP authorization: admins/{uid} with active=true and role admin/hoi.
  try {
    const adminSnap = await db.collection('admins').doc(uid).get();
    if (adminSnap.exists) {
      const admin = adminSnap.data() || {};
      const role = String(admin.role || admin.accessRole || '').trim().toLowerCase();
      const active = admin.active !== false;
      if (active && ['admin', 'hoi', 'school_admin', 'head_of_institution'].includes(role)) {
        return { uid, source: 'admins', role };
      }
    }
  } catch (err) {
    logger.error('Administrator record lookup failed', { uid, error: serializeError(err) });
    throw new HttpsError('internal', 'Administrator authorization could not be verified.', {
      function: 'requireSchoolAdmin',
      backendCode: err?.code || err?.name || 'unknown',
    });
  }

  // Compatibility fallback for existing installations where an admin is
  // represented in the staff collection rather than admins/{uid}.
  try {
    const staff = await getLinkedStaff(uid);
    if (isAdmin(staff.data)) return { uid, source: 'staff', staffId: staff.id };
  } catch (err) {
    if (err instanceof HttpsError && err.code === 'permission-denied') {
      throw err;
    }
    logger.error('Administrator staff fallback lookup failed', { uid, error: serializeError(err) });
    throw new HttpsError('internal', 'Administrator authorization could not be verified.', {
      function: 'requireSchoolAdmin',
      backendCode: err?.code || err?.name || 'unknown',
    });
  }

  throw new HttpsError('permission-denied', 'Active Admin or HOI authorization is required.');
}

function serializeError(err) {
  return {
    name: err?.name || 'Error',
    message: err?.message || String(err),
    code: err?.code || null,
    stack: err?.stack || null,
  };
}

function toHttpsError(err, functionName) {
  if (err instanceof HttpsError) return err;

  const code = String(err?.code || '').toLowerCase();
  let message = err?.message || 'The server could not complete the request.';
  let publicCode = 'internal';

  if (code.includes('permission-denied') || code === 'permission-denied') {
    publicCode = 'permission-denied';
    message = 'The authenticated account is not authorized for this operation.';
  } else if (code.includes('unauthenticated') || code === 'unauthenticated') {
    publicCode = 'unauthenticated';
    message = 'Firebase authentication is required.';
  } else if (code.includes('not-found') || code === 'not-found') {
    publicCode = 'not-found';
  } else if (code.includes('invalid-argument') || code === 'invalid-argument') {
    publicCode = 'invalid-argument';
  } else if (code.includes('failed-precondition') || code === 'failed-precondition') {
    publicCode = 'failed-precondition';
  } else if (code.includes('already-exists') || code === 'already-exists') {
    publicCode = 'already-exists';
  }

  return new HttpsError(publicCode, message, {
    function: functionName,
    backendCode: err?.code || err?.name || 'unknown',
  });
}

function callable(functionName, handler) {
  return onCall(async request => {
    try {
      return await handler(request);
    } catch (err) {
      const safe = serializeError(err);
      logger.error(`${functionName} failed`, safe);
      throw toHttpsError(err, functionName);
    }
  });
}

function b64url(bytes) {
  return Buffer.from(bytes).toString('base64url');
}
function fromB64url(value) {
  return new Uint8Array(Buffer.from(String(value), 'base64url'));
}
function isTeacher(staff) {
  const role = String(staff.role || '').trim().toUpperCase();
  const access = String(staff.accessRole || '').trim().toUpperCase();
  const designation = String(staff.designation || staff.roleDesignation || '').trim();
  return role === 'TEACHER' || access === 'TEACHER' || (access === 'STAFF' && /teacher/i.test(designation));
}
function isAdmin(staff) {
  const role = String(staff.role || '').trim().toUpperCase();
  const access = String(staff.accessRole || '').trim().toUpperCase();
  return ['ADMIN', 'SCHOOL_ADMIN', 'HOI', 'HEAD_OF_INSTITUTION'].includes(role) ||
         ['ADMIN', 'SCHOOL_ADMIN', 'HOI', 'HEAD_OF_INSTITUTION'].includes(access);
}
function haversineMeters(lat1, lon1, lat2, lon2) {
  const rad = n => n * Math.PI / 180;
  const R = 6371000;
  const dLat = rad(lat2 - lat1), dLon = rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

async function getAttendanceSettings() {
  const snap = await db.collection('institution').doc('attendanceSettings').get();
  const x = snap.exists ? snap.data() || {} : {};
  const radius = Number(x.geofenceRadiusMeters);
  const lat = Number(x.geofenceLat);
  const lng = Number(x.geofenceLng);
  return {
    ...x,
    requireGeofence: x.requireGeofence !== false,
    requireWebAuthn: x.requireWebAuthn !== false,
    geofenceRadiusMeters: Number.isFinite(radius) && radius > 0 ? radius : 100,
    geofenceLat: Number.isFinite(lat) ? lat : null,
    geofenceLng: Number.isFinite(lng) ? lng : null,
    maxLocationAccuracyMeters: Number.isFinite(Number(x.maxLocationAccuracyMeters)) ? Number(x.maxLocationAccuracyMeters) : 100,
  };
}

async function saveChallenge(uid, type, challenge) {
  await db.collection('webauthnChallenges').doc(uid).set({
    type,
    challenge,
    createdAt: FieldValue.serverTimestamp(),
    expiresAtMs: Date.now() + CHALLENGE_TTL_MS,
  });
}

async function consumeChallenge(uid, type) {
  const ref = db.collection('webauthnChallenges').doc(uid);
  const snap = await ref.get();
  if (!snap.exists) throw new HttpsError('failed-precondition', 'The security challenge is missing or expired. Please try again.');
  const data = snap.data() || {};
  await ref.delete();
  if (data.type !== type || Number(data.expiresAtMs) < Date.now()) {
    throw new HttpsError('failed-precondition', 'The security challenge has expired. Please try again.');
  }
  return data.challenge;
}

async function credentialDocs(staffId) {
  const snap = await db.collection('staff').doc(staffId).collection('webauthnCredentials').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

exports.beginTeacherAttendancePasskeyRegistration = callable('beginTeacherAttendancePasskeyRegistration', async request => {
  const uid = requireAuth(request);
  const staff = await getLinkedStaff(uid);
  if (!isTeacher(staff.data)) throw new HttpsError('permission-denied', 'Teacher access is required.');

  const existing = await credentialDocs(staff.id);
  const userId = Buffer.from(staff.id, 'utf8');
  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: RP_ID,
    userName: String(staff.data.employeeId || staff.id),
    userDisplayName: String(staff.data.name || 'Teacher'),
    userID: userId,
    attestationType: 'none',
    excludeCredentials: existing.map(c => ({ id: c.id, transports: c.transports || undefined })),
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      residentKey: 'required',
      userVerification: 'required',
    },
    supportedAlgorithmIDs: [-7, -257],
  });
  await saveChallenge(uid, 'registration', options.challenge);
  return options;
});

exports.finishTeacherAttendancePasskeyRegistration = callable('finishTeacherAttendancePasskeyRegistration', async request => {
  const uid = requireAuth(request);
  const staff = await getLinkedStaff(uid);
  if (!isTeacher(staff.data)) throw new HttpsError('permission-denied', 'Teacher access is required.');
  const response = request.data?.response;
  if (!response) throw new HttpsError('invalid-argument', 'Registration response is missing.');
  const challenge = await consumeChallenge(uid, 'registration');

  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: challenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      requireUserVerification: true,
    });
  } catch (err) {
    logger.error('WebAuthn registration verification failed', err);
    throw new HttpsError('invalid-argument', 'The biometric/passkey registration could not be verified.');
  }
  if (!verification.verified || !verification.registrationInfo) {
    throw new HttpsError('invalid-argument', 'The security credential was not verified.');
  }
  const c = verification.registrationInfo.credential;
  await db.collection('staff').doc(staff.id).collection('webauthnCredentials').doc(c.id).set({
    id: c.id,
    publicKey: b64url(c.publicKey),
    counter: c.counter || 0,
    transports: response.response?.transports || [],
    deviceType: verification.registrationInfo.credentialDeviceType || 'unknown',
    backedUp: verification.registrationInfo.credentialBackedUp || false,
    createdAt: FieldValue.serverTimestamp(),
    userVerificationRequired: true,
  });
  return { verified: true, credentialId: c.id };
});

exports.beginTeacherAttendanceVerification = callable('beginTeacherAttendanceVerification', async request => {
  const uid = requireAuth(request);
  const staff = await getLinkedStaff(uid);
  if (!isTeacher(staff.data)) throw new HttpsError('permission-denied', 'Teacher access is required.');
  const credentials = await credentialDocs(staff.id);
  if (!credentials.length) throw new HttpsError('failed-precondition', 'No secure attendance passkey is registered for this teacher.');
  const options = await generateAuthenticationOptions({
    rpID: RP_ID,
    userVerification: 'required',
    allowCredentials: credentials.map(c => ({ id: c.id, transports: c.transports || undefined })),
  });
  await saveChallenge(uid, 'authentication', options.challenge);
  return options;
});

exports.secureTeacherAttendance = callable('secureTeacherAttendance', async request => {
  const uid = requireAuth(request);
  const staff = await getLinkedStaff(uid);
  if (!isTeacher(staff.data)) throw new HttpsError('permission-denied', 'Teacher access is required.');

  const action = String(request.data?.action || '').toLowerCase();
  if (!['checkin', 'checkout'].includes(action)) throw new HttpsError('invalid-argument', 'Invalid attendance action.');

  const position = request.data?.position || {};
  const lat = Number(position.lat), lng = Number(position.lng), accuracy = Number(position.accuracy);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) throw new HttpsError('invalid-argument', 'A valid device location is required.');
  if (!Number.isFinite(accuracy) || accuracy < 0) throw new HttpsError('invalid-argument', 'Location accuracy could not be verified.');

  const settings = await getAttendanceSettings();
  if (settings.requireGeofence) {
    if (settings.geofenceLat === null || settings.geofenceLng === null) {
      throw new HttpsError('failed-precondition', 'School attendance location has not been configured by the administrator.');
    }
    if (accuracy > settings.maxLocationAccuracyMeters) {
      throw new HttpsError('failed-precondition', `Location accuracy is too low (${Math.round(accuracy)} m). Move to an area with better GPS accuracy and try again.`);
    }
    const distance = haversineMeters(lat, lng, settings.geofenceLat, settings.geofenceLng);
    if (distance > settings.geofenceRadiusMeters) {
      throw new HttpsError('permission-denied', `You are outside the school attendance range (${Math.round(distance)} m away; allowed ${Math.round(settings.geofenceRadiusMeters)} m).`);
    }
  }

  if (settings.requireWebAuthn) {
    const response = request.data?.webauthnResponse;
    if (!response) throw new HttpsError('failed-precondition', 'Biometric/passkey verification is required for attendance.');
    const challenge = await consumeChallenge(uid, 'authentication');
    const credentialRef = db.collection('staff').doc(staff.id).collection('webauthnCredentials').doc(String(response.id || ''));
    const credSnap = await credentialRef.get();
    if (!credSnap.exists) throw new HttpsError('permission-denied', 'This security credential is not registered for the teacher.');
    const saved = credSnap.data() || {};
    let verification;
    try {
      verification = await verifyAuthenticationResponse({
        response,
        expectedChallenge: challenge,
        expectedOrigin: ORIGIN,
        expectedRPID: RP_ID,
        requireUserVerification: true,
        credential: {
          id: saved.id,
          publicKey: fromB64url(saved.publicKey),
          counter: Number(saved.counter || 0),
          transports: saved.transports || [],
        },
      });
    } catch (err) {
      logger.error('WebAuthn attendance verification failed', err);
      throw new HttpsError('permission-denied', 'Biometric/passkey verification failed. Attendance was not recorded.');
    }
    if (!verification.verified) throw new HttpsError('permission-denied', 'Biometric/passkey verification failed.');
    const newCounter = verification.authenticationInfo?.newCounter;
    if (Number.isFinite(newCounter)) await credentialRef.update({ counter: newCounter, lastUsedAt: FieldValue.serverTimestamp() });
  }

  const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const time = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
  const ref = db.collection('staffAttendance').doc(`${staff.id}_${date}`);
  const snap = await ref.get();
  const existing = snap.exists ? snap.data() || {} : {};

  if (action === 'checkin' && existing.checkIn) throw new HttpsError('already-exists', 'Today is already checked in.');
  if (action === 'checkout' && !existing.checkIn) throw new HttpsError('failed-precondition', 'Check in must be recorded first.');
  if (action === 'checkout' && existing.checkOut) throw new HttpsError('already-exists', 'Today is already checked out.');

  const patch = {
    staffId: staff.id,
    staffAuthUid: uid,
    staffName: staff.data.name || '',
    employeeId: staff.data.employeeId || '',
    date,
    updatedAt: FieldValue.serverTimestamp(),
    location: { lat, lng, accuracy, distanceMeters: settings.geofenceLat === null ? null : haversineMeters(lat, lng, settings.geofenceLat, settings.geofenceLng) },
    securityMethod: settings.requireWebAuthn ? 'WebAuthn-user-verification' : 'location-only',
  };
  if (action === 'checkin') {
    patch.checkIn = time;
    patch.checkInAt = FieldValue.serverTimestamp();
    patch.status = 'Present';
  } else {
    patch.checkOut = time;
    patch.checkOutAt = FieldValue.serverTimestamp();
    patch.status = 'Present';
    patch.attendanceCompleted = true;
  }
  await ref.set(patch, { merge: true });
  return { ok: true, date, time, action, securityMethod: patch.securityMethod };
});

exports.setTeacherAttendanceGeofence = callable('setTeacherAttendanceGeofence', async request => {
  const { uid } = await requireSchoolAdmin(request);
  const lat = Number(request.data?.lat), lng = Number(request.data?.lng), radius = Number(request.data?.radiusMeters);
  const maxAccuracy = Number(request.data?.maxLocationAccuracyMeters ?? 100);
  if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lng) || lng < -180 || lng > 180) {
    throw new HttpsError('invalid-argument', 'Valid school latitude and longitude are required.');
  }
  if (!Number.isFinite(radius) || radius < 20 || radius > 5000) throw new HttpsError('invalid-argument', 'Attendance range must be between 20 m and 5000 m.');
  if (!Number.isFinite(maxAccuracy) || maxAccuracy < 10 || maxAccuracy > 1000) throw new HttpsError('invalid-argument', 'GPS accuracy limit must be between 10 m and 1000 m.');
  await db.collection('institution').doc('attendanceSettings').set({
    geofenceLat: lat,
    geofenceLng: lng,
    geofenceRadiusMeters: radius,
    maxLocationAccuracyMeters: maxAccuracy,
    requireGeofence: true,
    requireWebAuthn: true,
    geofenceUpdatedAt: FieldValue.serverTimestamp(),
    geofenceUpdatedBy: uid,
  }, { merge: true });
  return { ok: true, lat, lng, radiusMeters: radius, maxLocationAccuracyMeters: maxAccuracy };
});
