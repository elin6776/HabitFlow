import { db, auth } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, getDoc,collection, addDoc, getDocs, updateDoc,Timestamp } from 'firebase/firestore'; 
import { useRouter } from 'expo-router';
import { getAuth } from "firebase/auth";


//Auth//
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
    const user = auth.currentUser;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      username: username,
      email: email,
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

//Daily Tasks//
export const fetchTasks = async (userId) => {
  if (!userId) throw new Error("User is not authenticated.");

  try {
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

//Discussion Board//
export const addDiscussionChallenge = async (title, description) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("Not logged in");
  const userDocRef = doc(db, "users", user.uid);
  const userDocSnap = await getDoc(userDocRef);
  const username = userDocSnap.exists() ? userDocSnap.data().username : "Anonymous";

  const docRef = await addDoc(collection(db, "discussion_board_challenges"), {
    title,
    description,
    userID: user.uid,
    username: username,
    avatarUrl: user.photoURL || "https://s3-alpha-sig.figma.com/img/8b62/1cd5/3edeeae6fe3616bdf2812d44e6f4f6ef?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=emv7w1QsDjwmrYSiKtEgip8jIWylb3Y-X19pOuAS4qkod6coHm-XpmS8poEzUjvqiikwbYp1yQNL1J4O6C9au3yiy-c95qnrtmWFJtvHMLHCteLJjhQgOJ0Kdm8tsw8kzw7NhZAOgMzMJ447deVzCecPcSPRXLGCozwYFYRmdCRtkwJ9JBvM~4jqBKIiryVGeEED5ZIOQsC1yZsYrcSCAnKjZb7eBcRr1iHfH-ihDA9Z1UPAEJ5vTau7aMvNnaHD56wt~jNx0jf8wvQosLhmMigGvqx5dnV~3PpavHpfs6DJclhW3pv9BJ25ZH9nLuNAfAW6a2X4Qw4KLESnH6fVGg__",
    createdAt: new Date().toISOString(),
    likes: 0,
  });

  return docRef.id;
};

export const fetchDiscussionChallenges = async () => {
  const snapshot = await getDocs(collection(db, "discussion_board_challenges"));

  const data = await Promise.all(
    snapshot.docs.map(async (docSnap) => {
      const baseData = { id: docSnap.id, ...docSnap.data() };

      const commentsRef = collection(db, "discussion_board_challenges", docSnap.id, "comments");
      const commentsSnap = await getDocs(commentsRef);
      const commentsCount = commentsSnap.size;

      return {
        ...baseData,
        comments_count: commentsCount,
      };
    })
  );

  return data;
};


export const fetchGeneralDiscussions = async () => {
  const snapshot = await getDocs(collection(db, "discussion_board_general"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const addGeneralDiscussion = async (title, description) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const userDocRef = doc(db, "users", user.uid);
  const userDocSnap = await getDoc(userDocRef);
  const username = userDocSnap.exists() ? userDocSnap.data().username : "Anonymous";

  if (!user) throw new Error("Not logged in");

  const docRef = await addDoc(collection(db, "discussion_board_general"), {
    title,
    description,
    userID: user.uid,
    username: username,
    avatarUrl: user.photoURL || "https://s3-alpha-sig.figma.com/img/8b62/1cd5/3edeeae6fe3616bdf2812d44e6f4f6ef?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=emv7w1QsDjwmrYSiKtEgip8jIWylb3Y-X19pOuAS4qkod6coHm-XpmS8poEzUjvqiikwbYp1yQNL1J4O6C9au3yiy-c95qnrtmWFJtvHMLHCteLJjhQgOJ0Kdm8tsw8kzw7NhZAOgMzMJ447deVzCecPcSPRXLGCozwYFYRmdCRtkwJ9JBvM~4jqBKIiryVGeEED5ZIOQsC1yZsYrcSCAnKjZb7eBcRr1iHfH-ihDA9Z1UPAEJ5vTau7aMvNnaHD56wt~jNx0jf8wvQosLhmMigGvqx5dnV~3PpavHpfs6DJclhW3pv9BJ25ZH9nLuNAfAW6a2X4Qw4KLESnH6fVGg__",
    createdAt: new Date().toISOString(),
    likes: 0,
  });

  return docRef.id;
};


export const toggleLike = async (postId, isChallenge = true) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");

  const collectionName = isChallenge ? "discussion_board_challenges" : "discussion_board_general";
  const postRef = doc(db, collectionName, postId);
  const postSnap = await getDoc(postRef);

  if (!postSnap.exists()) throw new Error("Post not found");

  const data = postSnap.data();
  const likedBy = data.liked_by || [];
  const hasLiked = likedBy.includes(user.uid);

  const updatedLikedBy = hasLiked
    ? likedBy.filter((uid) => uid !== user.uid)
    : [...likedBy, user.uid];

  const updatedLikes = updatedLikedBy.length;

  await updateDoc(postRef, {
    liked_by: updatedLikedBy,
    likes: updatedLikes,
  });

  

  
};