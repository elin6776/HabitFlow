// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
require('dotenv').config(); 

// Firebase config object obtained from your Firebase console
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  messagingSenderId: process.env.SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID 
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export Firestore database
export const db = getFirestore(app);