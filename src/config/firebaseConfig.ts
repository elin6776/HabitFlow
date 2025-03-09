// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase config object obtained from your Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyAKnbXbJnRTF0bv1fWA8xzrnLB6ZL_TgAY",
  authDomain: "habitflow-499.firebaseapp.com",
  projectId: "habitflow-499",
  messagingSenderId: "847136305370",
  appId: "1:847136305370:android:c30e359a572684add4b5e3",
  measurementId: "G-XV6HHD4WJX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

// Function to save a "hello" message to Firestore
export const saveHelloToFirestore = async () => {
  try {
    // Adding a new document to the "messages" collection with the "hello" message
    const docRef = await addDoc(collection(db, "messages"), {
      message: "hello",
      timestamp: new Date(),
    });

    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
