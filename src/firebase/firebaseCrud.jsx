import { db, auth } from '../config/firebaseConfig';
import { getAuth } from '@react-native-firebase/auth';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, collection, addDoc, getDocs, getDoc, updateDoc, query, where } from 'firebase/firestore'; 
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

    //console.log("Task completion toggled successfully");

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
    //console.log("Current user UID: ", user.uid);

    const tasksRef = collection(db, "users", user.uid, "daily_tasks");

    await addDoc(tasksRef, {
      title,
      time,
      repeat_days,
      is_completed: false,
      createdAt: new Date(),
    });

    //console.log("Task added successfully");
  } catch (error) {
    console.error("Error adding task:", error.message); 
  }
};

export const addChallenge = async ({ title, description, duration, task, frequency }) => {
  try {
    const auth = getAuth();

    const user = auth.currentUser;
    if (!user) {
      console.log("No user is signed in");
      return;
    }
    const userID = user.uid;
    //console.log("Current user UID: ", user.uid);
    
    let points; 
    if (duration === 14) {  
      points = 20;  
    } else if (duration === 21) {  
      points = 33;  
    } else if (duration === 28) {  
      points = 48;  
    } else {  
      points = 7;  
    }
    
    const tasksRef = collection(db, "challenges");
    await addDoc(tasksRef, {
      userID,
      title,
      description,
      duration,
      task,
      frequency,
      points,
      createdAt: new Date(),
    });

    //console.log("Task added successfully");
  } catch (error) {
    console.error("Error adding task:", error.message); 
  }
};

export const fetchChallenges = async () => {
  try {
    const challengesCollection = collection(db, "challenges");
    const challengesSnapshot = await getDocs(challengesCollection);

    return challengesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching challenges:", error);
    throw error;
  }
};

export const acceptChallenge = async ({ challengeUid }) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.log("No user is signed in");
      return;
    }
    //console.log("Current user UID: ", user.uid);

    const duplicateRef = collection(db, "users", user.uid, "accepted_challenges");
    const q = query(duplicateRef, where("challengeId", "==", challengeUid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.log("Challenge already accepted");
      return;
    }

    const challengeRef = doc(db, "challenges", challengeUid); 
    const challengeSnap = await getDoc(challengeRef);

    if (!challengeSnap.exists()) {
      console.log("Challenge not found");
      return;
    }
    
    const challengeData = challengeSnap.data(); 
    const { title, description, task, points, duration, frequency } = challengeData;

    const acceptedRef = collection(db, "users", user.uid, "accepted_challenges");

    await addDoc(acceptedRef, {
      challengeId: challengeUid,  
      title,
      description,
      task,
      duration,
      frequency,
      points: points || 0,         
      status: "incomplete",       
      acceptedAt: new Date()       
    });

    //console.log("Challenge added successfully");
  } catch (error) {
    console.error("Error adding challenge:", error.message); 
  }
};


export const fetchAcceptedChallenges = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.log("No user is signed in");
      return [];
    }

    const acceptedRef = collection(db, "users", user.uid, "accepted_challenges");
    const querySnapshot = await getDocs(acceptedRef);

    return querySnapshot.docs.map((doc) => doc.data().challengeId);
  } catch (error) {
    console.error("Error fetching accepted challenges:", error.message);
    return [];
  }
};