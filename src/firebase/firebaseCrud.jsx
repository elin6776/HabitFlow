import { db, auth } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { setDoc, doc, getDoc, collection, addDoc, getDocs, updateDoc, Timestamp, query, orderBy, where, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';


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
      points: 0,
    });

    alert("Sign up successful!");
    router.push("/login");
  } catch (error) {
    alert("Sign up failed: " + error.message);
  }
};


export const fetchDailyTasks = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser; 
    if (!user) throw new Error("User is not authenticated.");
    const tasksCollection = collection(db, "users", user.uid, "daily_tasks");
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

export const fetchAcceptedChallenges = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.log("No user is signed in");
      return [];
    }
    const userId = user.uid;
    const acceptedCollection = collection(db, "users", userId, "accepted_challenges");
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

export const filterChallenges = async () => {
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

//Create Challenge
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
      points = 9;  
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
    username,
    avatarUrl: user.photoURL || "默认头像链接",
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

      return { ...baseData, comments_count: commentsCount };
    })
  );

  return data;
};

export const addGeneralDiscussion = async (title, description) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const userDocSnap = await getDoc(doc(db, "users", user.uid));
  const username = userDocSnap.exists() ? userDocSnap.data().username : "Anonymous";

  if (!user) throw new Error("Not logged in");

  const docRef = await addDoc(collection(db, "discussion_board_general"), {
    title,
    description,
    userID: user.uid,
    username,
    avatarUrl: user.photoURL || "默认头像链接",
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

  const likedBy = postSnap.data().liked_by || [];
  const hasLiked = likedBy.includes(user.uid);
  const updatedLikedBy = hasLiked
    ? likedBy.filter((uid) => uid !== user.uid)
    : [...likedBy, user.uid];

  await updateDoc(postRef, {
    liked_by: updatedLikedBy,
    likes: updatedLikedBy.length,
  });
};



// discussion General/Other
export const fetchGeneralDiscussions = async () => {
  try {
      const discussionsQuery = query(collection(db, "discussion_board_general"), orderBy("createdAt", "desc"));
      const discussionsSnapshot = await getDocs(discussionsQuery);

      const postsWithCommentCounts = await Promise.all(
        discussionsSnapshot.docs.map(async (doc) => {
          const commentsSnapshot = await getDocs(
            collection(db, "discussion_board_general", doc.id, "comments")
          );
      
          return {
            id: doc.id,
            ...doc.data(),
            commentsCount: commentsSnapshot.size,
          };
        })
      );
      
      return postsWithCommentCounts; 
  } catch (error) {
      console.error("Error fetching discussions:", error);
      return [];
  }
};

// discussion Challenges
export const fetchChallengeDiscussions = async () => {
  try {
      const discussionsQuery = query(collection(db, "discussion_board_challenges"), orderBy("createdAt", "desc"));
      const discussionsSnapshot = await getDocs(discussionsQuery);

      const postsWithCommentCounts = await Promise.all(
        discussionsSnapshot.docs.map(async (doc) => {
          const commentsSnapshot = await getDocs(
            collection(db, "discussion_board_challenges", doc.id, "comments")
          );
      
          return {
            id: doc.id,
            ...doc.data(),
            commentsCount: commentsSnapshot.size,
          };
        })
      );
      
      return postsWithCommentCounts; 
  } catch (error) {
      console.error("Error fetching discussions:", error);
      return [];
  }
};
//test discussion connect
// fetchGeneralDiscussions().then(data => console.log("General Discussions:", data));
// fetchChallengeDiscussions().then(data => console.log("Challenge Discussions:", data));

//Get comments and replies part
//Regular comments and replies
export const fetchRegularCommentsWithReplies = async (postId) => {
  try {
    const commentsCollection = collection(db, "discussion_board_general", postId, "comments");
    const commentSnapshot = await getDocs(commentsCollection);

    const comments = await Promise.all(
      commentSnapshot.docs.map(async (doc) => {
        const repliesCollection = collection(db, "discussion_board_general", postId, "comments", doc.id, "replies");
        const repliesSnapshot = await getDocs(repliesCollection);
        const replies = repliesSnapshot.docs.map(reply => ({ id: reply.id, ...reply.data() }));
        return { id: doc.id, ...doc.data(), replies };
      })
    );

    return comments;
  } catch (err) {
    console.error("Error fetching regular comments and replies", err);
    return [];
  }
};

export const addCommentToGeneralPost = async (postId, text) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    const username = userDocSnap.exists() ? userDocSnap.data().username : "Anonymous";

    const commentRef = collection(db, "discussion_board_general", postId, "comments");
    //console.log("Current user:", auth.currentUser);
    await addDoc(commentRef, {
      text,
      uid: user.uid,
      username: username,
      createdAt: new Date(),
    });

    return true;
  } catch (err) {
    console.error("Failed to add comment:", err);
    return false;
  }
};
export const addReplyToGeneralPost = async (postId, commentId, text) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const userDocSnap = await getDoc(doc(db, "users", user.uid));
    const username = userDocSnap.exists() ? userDocSnap.data().username : "Anonymous";

    const replyRef = collection(db, "discussion_board_general", postId, "comments", commentId, "replies");
    await addDoc(replyRef, {
      text,
      uid: user.uid,
      username,
      createdAt: new Date(),
    });

    return true;
  } catch (err) {
    console.error("Failed to add reply:", err);
    return false;
  }
};
// challenge comment and replies
export const fetchChallengeCommentsWithReplies = async (postId) => {
  try {
    const commentsCollection = collection(db, "discussion_board_challenges", postId, "comments");
    const commentSnapshot = await getDocs(commentsCollection);

    const comments = await Promise.all(
      commentSnapshot.docs.map(async (doc) => {
        const repliesCollection = collection(db, "discussion_board_challenges", postId, "comments", doc.id, "replies");
        const repliesSnapshot = await getDocs(repliesCollection);
        const replies = repliesSnapshot.docs.map(reply => ({ id: reply.id, ...reply.data() }));
        return { id: doc.id, ...doc.data(), replies };
      })
    );

    return comments;
  } catch (err) {
    console.error("Error fetching challenge comments and replies", err);
    return [];
  }
};
export const addCommentToChallengePost = async (postId, text) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    const username = userDocSnap.exists() ? userDocSnap.data().username : "Anonymous";

    const commentRef = collection(db, "discussion_board_challenges", postId, "comments");
    //console.log("Current user:", auth.currentUser);
    await addDoc(commentRef, {
      text,
      uid: user.uid,
      username: username,
      createdAt: new Date(),
    });

    return true;
  } catch (err) {
    console.error("Failed to add comment:", err);
    return false;
  }
};
export const addReplyToChallengePost = async (postId, commentId, text) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const userDocSnap = await getDoc(doc(db, "users", user.uid));
    const username = userDocSnap.exists() ? userDocSnap.data().username : "Anonymous";

    const replyRef = collection(db, "discussion_board_challenges", postId, "comments", commentId, "replies");
    await addDoc(replyRef, {
      text,
      uid: user.uid,
      username,
      createdAt: new Date(),
    });

    return true;
  } catch (err) {
    console.error("Failed to add reply:", err);
    return false;
  }

};