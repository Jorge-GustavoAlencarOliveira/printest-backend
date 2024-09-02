import admin from 'firebase-admin'

var serviceAccount = require("../../serviceAccountKey.json");

const authFirebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export {authFirebase}