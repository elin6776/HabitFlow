import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getReactNativePersistence, initializeAuth, getAuth } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Firebase config object obtained from your Firebase console
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  messagingSenderId: process.env.SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID 
};

// Initialize Firebase app (only once)
const app = initializeApp(firebaseConfig);

// Use AsyncStorage for persistent login
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db, getAuth };