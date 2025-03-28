import { db, auth } from "../config/firebaseConfig";
import { getAuth } from "@react-native-firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  setDoc,
  doc,
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { useRouter } from "expo-router";

export const signUpUser = async (
  email,
  password,
  username,
  confirm,
  router
) => {
  if (!email || !password || !username || !confirm) {
    alert("Please fill out all the information.");
    return;
  }
  if (password !== confirm) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      username: username,
      email: email,
      createdAt: new Date().toISOString(),
      points: 0,
    });

    alert("Sign up successful!");
    router.push("/login");
  } catch (error) {
    alert("Sign up failed: " + error.message);
  }
};

//Homepage

//Fetch daily tasks
export const fetchDailyTasks = async () => {
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

// Create daily task
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
      updatedAt: new Date(),
    });

    //console.log("Task added successfully");
  } catch (error) {
    console.error("Error adding task:", error.message);
  }
};

// Update
// Delete
export const deleteDailyTask = async (taskUid) => {
  try {
    if (!taskUid) {
      console.log("Task UID is undefined");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.log("No user is signed in");
      return;
    }

    const taskRef = doc(db, "users", user.uid, "daily_tasks", taskUid);
    const taskSnap = await getDoc(taskRef);

    if (!taskSnap.exists()) {
      console.log("Task not found");
      return;
    }

    await deleteDoc(taskRef);
    //console.log("Daily task deleted successfully");
  } catch (error) {
    console.error("Error deleting daily task:", error.message);
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
      updatedAt: new Date(),
    });

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, is_completed: !currentStatus, updatedAt: new Date() }
          : task
      )
    );
  } catch (error) {
    console.error("Error toggling task completion:", error.message);
  }
};

export const toggleChallengeCompletion = async (
  taskId,
  currentStatus,
  setTasks
) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.log("No user is signed in");
      return;
    }

    const taskRef = doc(db, "users", user.uid, "accepted_challenges", taskId);
    const userRef = doc(db, "users", user.uid);

    const taskDoc = await getDoc(taskRef);
    const userDoc = await getDoc(userRef);

    const taskData = taskDoc.data();
    const userData = userDoc.data();

    if (taskData.is_completed === false) {
      let add;
      if (taskData.frequency === "Daily") {
        add = 1;
      } else if (taskData.frequency === "Every other day") {
        add = 2;
      } else {
        add = 7;
      }

      const updatedProgress = taskData.progress + add;

      await updateDoc(taskRef, {
        is_completed: !currentStatus,
        updatedAt: new Date(),
        progress: updatedProgress,
      });

      if (updatedProgress >= taskData.duration) {
        await updateDoc(userRef, {
          points: (userData.points || 0) + (taskData.points || 0),
        });

        await deleteAcceptedChallenge(taskId);
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                is_completed: !currentStatus,
                updatedAt: new Date(),
                progress: updatedProgress,
              }
            : task
        )
      );
    }
  } catch (error) {
    console.error("Error toggling task completion:", error.message);
  }
};

//Challenges Page

//Fetch Challenges
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

//Fetch Accepted Challenges
export const fetchAcceptedChallenges = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.log("No user is signed in");
      return [];
    }
    const userId = user.uid;
    const acceptedCollection = collection(
      db,
      "users",
      userId,
      "accepted_challenges"
    );
    const acceptedSnapshot = await getDocs(acceptedCollection);

    return acceptedSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching accepted challenges:", error.message);
    return [];
  }
};

//Filter
export const filterChallenges = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.log("No user is signed in");
      return [];
    }

    const acceptedRef = collection(
      db,
      "users",
      user.uid,
      "accepted_challenges"
    );
    const querySnapshot = await getDocs(acceptedRef);

    return querySnapshot.docs.map((doc) => doc.data().challengeId);
  } catch (error) {
    console.error("Error fetching accepted challenges:", error.message);
    return [];
  }
};

//Create Challenge
export const addChallenge = async ({
  title,
  description,
  duration,
  task,
  frequency,
}) => {
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
      points = 9;
    }

    let repeat_days = [];
    if (frequency === "Daily") {
      repeat_days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
    } else if (frequency === "Weekly") {
      repeat_days = ["Monday"];
    } else if (frequency === "Every other day") {
      repeat_days = ["Monday", "Wednesday", "Friday", "Sunday"];
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
      repeat_days,
      createdAt: new Date(),
    });

    //console.log("Task added successfully");
  } catch (error) {
    console.error("Error adding task:", error.message);
  }
};

//Accept Challenges
export const acceptChallenge = async ({ challengeUid }) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.log("No user is signed in");
      return;
    }
    //console.log("Current user UID: ", user.uid);

    const duplicateRef = collection(
      db,
      "users",
      user.uid,
      "accepted_challenges"
    );
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
    const {
      title,
      description,
      task,
      points,
      duration,
      frequency,
      repeat_days,
    } = challengeData;

    const acceptedRef = collection(
      db,
      "users",
      user.uid,
      "accepted_challenges"
    );

    await addDoc(acceptedRef, {
      challengeId: challengeUid,
      title,
      description,
      task,
      duration,
      frequency,
      repeat_days,
      points: points || 0,
      is_completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: 0,
    });

    //console.log("Challenge added successfully");
  } catch (error) {
    console.error("Error adding challenge:", error.message);
  }
};

//Delete Challenges
export const deleteChallenge = async ({ challengeUid }) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.log("No user is signed in");
      return;
    }

    const challengeRef = doc(db, "challenges", challengeUid);
    const challengeSnap = await getDoc(challengeRef);

    if (!challengeSnap.exists()) {
      console.log("Challenge not found");
      return;
    }

    const challengeData = challengeSnap.data();
    if (challengeData.userID !== user.uid) {
      console.log("You are not authorized to delete this challenge");
      return;
    }

    await deleteDoc(challengeRef);
    console.log("Challenge deleted successfully");
  } catch (error) {
    console.error("Error deleting challenge:", error.message);
  }
};

//Deletes accepted challenges
export const deleteAcceptedChallenge = async (challengeUid) => {
  try {
    if (!challengeUid) {
      console.log("Challenge UID is undefined");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.log("No user is signed in");
      return;
    }

    const acceptedChallengeRef = doc(
      db,
      "users",
      user.uid,
      "accepted_challenges",
      challengeUid
    );
    const challengeSnap = await getDoc(acceptedChallengeRef);

    if (!challengeSnap.exists()) {
      console.log("Challenge not found");
      return;
    }

    await deleteDoc(acceptedChallengeRef);
  } catch (error) {
    console.error("Error deleting challenge:", error.message);
  }
};

//Discussion Page
// discussion Others
export const fetchGeneralDiscussions = async () => {
  try {
    const discussionsQuery = query(
      collection(db, "discussion_board_general"),
      orderBy("createdAt", "desc")
    );
    const discussionsSnapshot = await getDocs(discussionsQuery);

    return discussionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return [];
  }
};

// discussion Challenges
export const fetchChallengeDiscussions = async () => {
  try {
    const discussionsQuery = query(
      collection(db, "discussion_board_challenges"),
      orderBy("createdAt", "desc")
    );
    const discussionsSnapshot = await getDocs(discussionsQuery);

    return discussionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching challenge discussions:", error);
    return [];
  }
};

// Challenge filter
export const filterForChallenge = async (duration, frequency) => {
  try {
    const challengesCollection = collection(db, "challenges");

    // Query for challenges collection
    let challengeQuery = query(challengesCollection);

    // Apply duration filter if filter is not Null
    if (duration !== "Null" && duration !== null) {
      challengeQuery = query(
        challengeQuery,
        where("duration", "==", parseInt(duration))
      );
    }

    // Apply duration filter if filter is not Null
    if (frequency !== "Null") {
      challengeQuery = query(
        challengeQuery,
        where("frequency", "==", frequency)
      );
    }

    const challengeQuerySnapshot = await getDocs(challengeQuery);

    return challengeQuerySnapshot.docs.map((doc) => ({
      title: doc.data().title,
      task: doc.data().task,
      description: doc.data().description,
      duration: doc.data().duration,
      frequency: doc.data().frequency,
      points: doc.data().points,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching challenge:", error);
    return [];
  }
};
// const testFilter = async () => {
//   const challenges = await filterForChallenge("Null", "Null"); // Example duration and frequency
//   console.log(challenges); // Check the filtered challenges in the console
// };
// testFilter();
export const sortForChallenge = async (duration, frequency) => {
  try {
    const challengesCollection = collection(db, "challenges");

    // Query for challenges collection
    let challengeQuery = query(challengesCollection);

    return challengeQuerySnapshot.docs.map((doc) => ({
      title: doc.data().title,
      task: doc.data().task,
      description: doc.data().description,
      duration: doc.data().duration,
      frequency: doc.data().frequency,
      points: doc.data().points,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching challenge:", error);
    return [];
  }
};
