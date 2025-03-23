import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getReactNativePersistence, initializeAuth, getAuth } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Firebase config object obtained from your Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyAKnbXbJnRTF0bv1fWA8xzrnLB6ZL_TgAY",
  authDomain: "habitflow-499.firebaseapp.com",
  projectId: "habitflow-499",
  messagingSenderId: "847136305370",
  appId: "1:847136305370:android:c30e359a572684add4b5e3",
  measurementId: "G-XV6HHD4WJX"
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

//android: 55548382579-ua44mt2bvfg5tra45jr122d85gs9m8ga.apps.googleusercontent.com