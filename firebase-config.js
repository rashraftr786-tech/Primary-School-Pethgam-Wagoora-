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

// The ERP pages specifically look for this global name.
window.GPS_FIREBASE_CONFIG = GPS_FIREBASE_CONFIG;

// Also expose the generic name for compatibility with other modules.
window.firebaseConfig = GPS_FIREBASE_CONFIG;

try {
  if (typeof firebase !== "undefined") {
    if (!firebase.apps || firebase.apps.length === 0) {
      firebase.initializeApp(GPS_FIREBASE_CONFIG);
    }
    window.firebaseApp = firebase.app();

    if (typeof firebase.firestore === "function") {
      window.db = firebase.firestore();
    }

    if (typeof firebase.auth === "function") {
      window.auth = firebase.auth();
    }
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
  window.firebaseInitError = error;
}
