
import { db, auth } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from 'expo-router';

export const signUpUser = async (email, password, username, confirm, router) => {
    if (!email || !password || !username || !confirm) {
      alert("Please fill out all the information.");
      return;
    }
    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: username,
        email: email,
        password: password,
        createdAt: new Date().toISOString(),
        accepted_challenges: [],
        daily_tasks: [],
        points: 0,
      });
  
      alert("Sign up successful!");
      router.push("/login");
    } catch (error) {
      alert("Sign up failed: " + error.message);
    }
  };
  