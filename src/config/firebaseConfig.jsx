// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
require('dotenv').config(); 

// Firebase config object obtained from your Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyAKnbXbJnRTF0bv1fWA8xzrnLB6ZL_TgAY",
  authDomain: "habitflow-499.firebaseapp.com",
  projectId: "habitflow-499",
  messagingSenderId: "847136305370",
  appId: "1:847136305370:android:c30e359a572684add4b5e3",
  measurementId: "G-XV6HHD4WJX"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export Firestore database
export const db = getFirestore(app);