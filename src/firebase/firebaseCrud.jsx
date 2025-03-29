import { db, auth } from '../config/firebaseConfig';
import { getAuth } from '@react-native-firebase/auth';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, collection, addDoc, getDocs, updateDoc, query, orderBy, where, deleteDoc, getDoc  } from 'firebase/firestore'; 
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
export const deleteAcceptedChallenge = async ({ challengeUid }) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.log("No user is signed in");
      return;
    }

    const acceptedRef = collection(db, "users", user.uid, "accepted_challenges");
    const q = query(acceptedRef, where("challengeId", "==", challengeUid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("Challenge not found");
      return;
    }

    await batch.commit();
    console.log("Challenge deleted successfully");
    
  } catch (error) {
    console.error("Error deleting challenge:", error.message);
  }
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
    avatarUrl: user.photoURL || "https://s3-alpha-sig.figma.com/img/8b62/1cd5/3edeeae6fe3616bdf2812d44e6f4f6ef?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=emv7w1QsDjwmrYSiKtEgip8jIWylb3Y-X19pOuAS4qkod6coHm-XpmS8poEzUjvqiikwbYp1yQNL1J4O6C9au3yiy-c95qnrtmWFJtvHMLHCteLJjhQgOJ0Kdm8tsw8kzw7NhZAOgMzMJ447deVzCecPcSPRXLGCozwYFYRmdCRtkwJ9JBvM~4jqBKIiryVGeEED5ZIOQsC1yZsYrcSCAnKjZb7eBcRr1iHfH-ihDA9Z1UPAEJ5vTau7aMvNnaHD56wt~jNx0jf8wvQosLhmMigGvqx5dnV~3PpavHpfs6DJclhW3pv9BJ25ZH9nLuNAfAW6a2X4Qw4KLESnH6fVGg__",
    createdAt: new Date().toISOString(),
    likes: 0,
  });

  return docRef.id;
};

export const toggleLike = async (postId, isChallenge = true) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const currentUserId = auth.currentUser?.uid;
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
  
  return {
    liked_by: updatedLikedBy,
    likes: updatedLikedBy.length,
  };
};

// delete General Discussion part
export const deleteGeneralDiscussion =async(postId)=>{
  try{
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");
    //console.log("user:",user);
    //console.log("currentUser id:",user.uid);

    const postRef = doc(db, "discussion_board_general", postId);

    const postSnap = await getDoc(postRef);
    if (!postSnap.exists()) throw new Error("Post does not exist");//check if the post is exists
    const postData = postSnap.data();
    if (postData.userID !== user.uid) {//check only the owner can delet post
      throw new Error("You are not authorized to delete this post");
    }

    await deleteDoc(postRef);
    return true;
  } catch (err) {
    console.error("Failed to delete Discussion:", err);
    return false;
  }
  //const currentUserUid = user.uid;
  //return currentUserUid;
};
export const deleteGeneralComment = async (postId, commentId) => {
  try{
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("Not logged in");

      const commentRef = doc(db, "discussion_board_general", postId, "comments", commentId);
      await deleteDoc(commentRef);
      return true;
  } catch (err) {
    console.error("Failed to add comment:", err);
    return false;
  }
};
export const deleteGeneralReply = async (postId, commentId, replyId) => {
  try{
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");

    const replyRef = doc(db, "discussion_board_general", postId, "comments", commentId, "replies", replyId);
    await deleteDoc(replyRef);
    return true;
  } catch (err) {
    console.error("Failed to delete reply:", err);
    return false;
  }
};

//delete Challenge Discussion part
export const deleteChallengeDiscussion = async (postId) => {
  try{
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");

    const postRef = doc(db, "discussion_board_challenges", postId);

    const postSnap = await getDoc(postRef);
    if (!postSnap.exists()) throw new Error("Post does not exist");//check if the post is exists
    const postData = postSnap.data();
    if (postData.userID !== user.uid) {//check only the owner can delet post
      throw new Error("You are not authorized to delete this post");
    }
    await deleteDoc(postRef);
    return true;
  } catch (err) {
    console.error("Failed to delete Discussion:", err);
    return false;
  }
};
export const deleteChallengeComment = async (postId, commentId) => {
  try{
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");

    const commentRef = doc(db, "discussion_board_challenges", postId, "comments", commentId);
    await deleteDoc(commentRef);
    return true;
  } catch (err) {
    console.error("Failed to delete Comment:", err);
    return false;
  }
};
export const deleteChallengeReply = async (postId, commentId, replyId) => {
  try{
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");

    const replyRef = doc(db, "discussion_board_challenges", postId, "comments", commentId, "replies", replyId);
    await deleteDoc(replyRef);
    return true;
  } catch (err) {
    console.error("Failed to delete Reply:", err);
    return false;
  }
};
//testing area
//test discussion connect
// fetchGeneralDiscussions().then(data => console.log("General Discussions:", data));



export const addDiscussionChallenge = async (title, description, linkedChallengeId) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const userDocSnap = await getDoc(doc(db, "users", user.uid));
  const username = userDocSnap.exists() ? userDocSnap.data().username : "Anonymous";

  if (!user) throw new Error("Not logged in");

  const docRef = await addDoc(collection(db, "discussion_board_challenges"), {
    title,
    description,
    linkedChallengeId, 
    userID: user.uid,
    username,
    avatarUrl: user.photoURL || "https://via.placeholder.com/50",
    createdAt: new Date().toISOString(),
    likes: 0,
  });

  return docRef.id;
};

