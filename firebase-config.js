// GPS Pethgam Wagoora ERP
// Firebase configuration for the new project:
// gps-pethgam-wagoora-portal
//
// This file uses the Firebase Compat SDK because the existing ERP pages
// use the browser-global `firebase` namespace.

const firebaseConfig = {
  apiKey: "AIzaSyADB32wJq886NNqMuJk5n1zO45oSi-bdLs",
  authDomain: "gps-pethgam-wagoora-portal.firebaseapp.com",
  projectId: "gps-pethgam-wagoora-portal",
  storageBucket: "gps-pethgam-wagoora-portal.firebasestorage.app",
  messagingSenderId: "243117067000",
  appId: "1:243117067000:web:a5320441bcbaed71e4490d",
  measurementId: "G-WMXPK3229Y"
};

// Make the configuration available to the existing ERP pages.
window.firebaseConfig = firebaseConfig;

// Initialize Firebase only when the Compat SDK has been loaded.
if (typeof firebase !== "undefined") {
  try {
    if (!firebase.apps || firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
    }
    window.firebaseApp = firebase.app();

    // Firestore is initialized when the Firestore Compat SDK is present.
    if (typeof firebase.firestore === "function") {
      window.db = firebase.firestore();
    }

    // Auth is initialized when the Auth Compat SDK is present.
    if (typeof firebase.auth === "function") {
      window.auth = firebase.auth();
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
    window.firebaseInitError = error;
  }
}
