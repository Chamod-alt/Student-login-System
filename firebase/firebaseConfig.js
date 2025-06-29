
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'student-register-68c1c.appspot.com',
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { db, bucket };
