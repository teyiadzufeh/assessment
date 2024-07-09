import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import fs from 'fs';
import { env } from 'process';

// const serviceAccountString = fs.readFileSync('./serviceAccount.json', 'utf-8');
// const serviceAccount = JSON.parse(serviceAccountString);

const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
  measurementId: env.FIREBASE_MEASUREMENT_ID
};

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// })

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);