import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getReactNativePersistence, initializeAuth, getAuth } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAKnbXbJnRTF0bv1fWA8xzrnLB6ZL_TgAY",
  authDomain: "habitflow-499.firebaseapp.com",
  projectId: "habitflow-499",
  messagingSenderId: "847136305370",
  appId: "1:847136305370:android:c30e359a572684add4b5e3",
  measurementId: "G-XV6HHD4WJX",
  storageBucket:"habitflow-499.firebasestorage.app"
};


const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);

export { auth, db, getAuth };

//android: 55548382579-ua44mt2bvfg5tra45jr122d85gs9m8ga.apps.googleusercontent.com