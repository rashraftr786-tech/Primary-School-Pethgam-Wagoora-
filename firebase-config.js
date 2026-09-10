// GPS Pethgam Wagoora ERP
// Firebase configuration for project: gps-pethgam-wagoora-portal
// Compatible with the Firebase Compat SDK used by the ERP.

const GPS_FIREBASE_CONFIG = {
  apiKey: "AIzaSyADB32wJq886NNqMuJk5n1zO45oSi-bdLs",
  authDomain: "gps-pethgam-wagoora-portal.firebaseapp.com",
  projectId: "gps-pethgam-wagoora-portal",
  storageBucket: "gps-pethgam-wagoora-portal.firebasestorage.app",
  messagingSenderId: "243117067000",
  appId: "1:243117067000:web:a5320441bcbaed71e4490d",
  measurementId: "G-WMXPK3229Y"
};

// Bootstrap administrator email(s) allowed to create the first admin document in the new project.
window.GPS_ADMIN_EMAILS = ["rashraftr786@gmail.com"];

// Cloudinary photograph configuration.

// Cloudinary is used for school/student photographs because Firebase Cloud Storage is not used by this portal.
window.GPS_CLOUDINARY = {
  cloudName: "wknkeiqp",
  uploadPreset: "gps-pethgam-photos",
  folder: "gps-pethgam/students",
  maxBytes: 8 * 1024 * 1024
};

// Canonical Firebase collections used by the portal.
window.GPS_FIREBASE_COLLECTIONS = { students:"students", studentAccounts:"studentAccounts", marksheets:"marksheets", notices:"notices", calendar:"calendar", timetables:"timetables", libraryBooks:"libraryBooks", libraryTransactions:"libraryTransactions" };

// The ERP pages specifically look for this global name.
window.GPS_FIREBASE_CONFIG = GPS_FIREBASE_CONFIG;

// Also expose the generic name for compatibility with other modules.
window.firebaseConfig = GPS_FIREBASE_CONFIG;

// Firebase SDKs initialize the app after this config file is loaded.
// Keeping this file configuration-only prevents load-order race conditions.
