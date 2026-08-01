const admin = require('firebase-admin');

// Expects a service account JSON path in FIREBASE_SERVICE_ACCOUNT_PATH, or the
// JSON itself (stringified) in FIREBASE_SERVICE_ACCOUNT_JSON — whichever is set.
// Get this file from Firebase Console > Project Settings > Service Accounts.
let initialized = false;

function initFirebase() {
  if (initialized) return admin;

  try {
    let credential;
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      credential = admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON));
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      credential = admin.credential.cert(require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH));
    } else {
      console.warn('[firebase] No service account configured — push notifications are disabled.');
      return null;
    }

    admin.initializeApp({ credential });
    initialized = true;
    return admin;
  } catch (err) {
    console.error('[firebase] Failed to initialize:', err.message);
    return null;
  }
}

module.exports = { initFirebase };
