import { db, auth } from '../config/firebaseConfig';
import { getAuth } from '@react-native-firebase/auth';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, collection, addDoc, getDocs, updateDoc } from 'firebase/firestore'; 
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

export const fetchTasks = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser; 

    if (!user) {
      throw new Error("User is not authenticated.");
    }

    const userId = user.uid;
    const tasksCollection = collection(db, "users", userId, "daily_tasks");
    const taskSnapshot = await getDocs(tasksCollection);

    return taskSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const toggleTaskCompletion = async (taskId, currentStatus, setTasks) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.log("No user is signed in");
      return;
    }

    const taskRef = doc(db, "users", user.uid, "daily_tasks", taskId);
    await updateDoc(taskRef, {
      is_completed: !currentStatus,
    });

    console.log("Task completion toggled successfully");

    // Update local state after Firestore update
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, is_completed: !currentStatus } : task
      )
    );

  } catch (error) {
    console.error("Error toggling task completion:", error.message);
  }
};


export const addDailyTask = async ({ title, time, repeat_days }) => {
  try {
    const auth = getAuth();

    const user = auth.currentUser;

    if (!user) {
      console.log("No user is signed in");
      return;
    }
    console.log("Current user UID: ", user.uid);

    const tasksRef = collection(db, "users", user.uid, "daily_tasks");

    await addDoc(tasksRef, {
      title,
      time,
      repeat_days,
      is_completed: false,
      createdAt: new Date(),
    });

    console.log("Task added successfully");
  } catch (error) {
    console.error("Error adding task:", error.message); 
  }
};
