import { db, auth } from "../config/firebaseConfig";
import { getAuth } from "@react-native-firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  setDoc,
  doc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  where,
  deleteDoc,
  getDoc,
  onSnapshot,
  limit,
} from "firebase/firestore";
import storage from "@react-native-firebase/storage";
import { ALERT_TYPE, Dialog, Toast } from "react-native-alert-notification";

export const signUpUser = async (
  email,
  password,
  username,
  confirm,
  router
) => {
  if (!email || !password || !username || !confirm) {
    Toast.show({
      type: ALERT_TYPE.WARNING,
      title: "Incomplete Information",
      textBody: "Please fill out all the information.",
    });
    return;
  }
  if (password !== confirm) {
    Toast.show({
      type: ALERT_TYPE.WARNING,
      title: "Password Mismatch",
      textBody: "Passwords does not match.",
    });
    return;
  }

  try {
    // Check if username already exist
    const userData = collection(db, "users");
    const queryData = query(userData, where("username", "==", username));
    const querySnapshot = await getDocs(queryData);
    if (!querySnapshot.empty) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Username Exists",
        textBody: `"${username}" already exists. Please enter another username.`,
      });
      return;
    }
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const flowerRef = storage().ref("/profile_imgs/flower.jpeg");
    const defaultPhotoUrl = await flowerRef.getDownloadURL();
    try {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: username,
        email: email,
        createdAt: new Date().toISOString(),
        points: 0,
        photoUrl: defaultPhotoUrl,
      });

      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Registration Successful",
        textBody: "You have successfully registered.",
        duration: 1000,
      });
      router.push("/login");
    } catch (error) {
      await user.delete();
    }
  } catch (error) {
    Toast.show({
      type: ALERT_TYPE.DANGER,
      title: "Sign Up Failed",
      textBody: error.message,
    });
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

export const updateDailyTaskCompletion = async (taskId, status) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const taskRef = doc(db, "users", user.uid, "daily_tasks", taskId);
    await updateDoc(taskRef, {
      is_completed: status,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Failed to update task status:", error);
  }
};

export const updateChallengeTaskCompletion = async (taskId, status) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const taskRef = doc(db, "users", user.uid, "accepted_challenges", taskId);
    await updateDoc(taskRef, {
      is_completed: status,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Failed to update task status:", error);
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

        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Challenge Completed!",
          textBody:
            "You've completed the challenge and earned " +
            taskData.points +
            " points!",
          button: "OK",
        });
        const completeddRef = collection(
          db,
          "users",
          user.uid,
          "completed_challenges"
        );
        //console.log("taskData:", taskData);
        //console.log("challenge_id:", taskData.challenge_id);
        await addDoc(completeddRef, {
          ...taskData,
          challengeId: taskData.challengeId,
          completedAt: new Date(),
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

export const acceptChallenge = async ({
  challengeUid,
  collaboratorUid = null,
  isCollaborative = false,
}) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.log("No user is signed in");
      return;
    }

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
      isCollaborative,
      collaboratorUid: collaboratorUid || null,
    });

    console.log("Challenge accepted successfully");
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

// Profile page
export const fetchUser = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User is not authenticated.");
    }

    const userId = user.uid;
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("User data not found.");
    }

    const userData = userSnap.data();

    const result = {
      uid: userId,
      username: userData.username,
      points: userData.points,
      photoUrl: userData.photoUrl || null,
    };

    return result;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const updateUserPhoto = async (uid, photoUrl) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      photoUrl,
    });
  } catch (error) {
    console.error("Error updating user photo:", error);
  }
};

// Inbox
export const fetchMail = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User is not authenticated.");
    }

    const userId = user.uid;
    const mailCollection = collection(db, "users", userId, "inbox");
    const mailSnapshot = await getDocs(mailCollection);

    if (mailSnapshot.empty) {
      return [];
    }

    return mailSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching mail:", error);
    throw error;
  }
};

export const markMessageAsRead = async (id) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated.");
  }
  
  const msgRef = doc(db, "users", user.uid, "inbox", id);
  await updateDoc(msgRef, { isRead: true });
};

// Delete Mail
export const deleteMail = async (mailId) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User is not authenticated.");
    }

    const userId = user.uid;
    const mailDocRef = doc(db, "users", userId, "inbox", mailId);

    await deleteDoc(mailDocRef);
    //console.log(`Mail with ID ${mailId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting mail:", error);
    throw error;
  }
};

//Invite
export const sendCollaborationInvite = async (toUsername, challengeId) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    // Get sender's username
    const fromUserRef = doc(db, "users", user.uid);
    const fromUserSnap = await getDoc(fromUserRef);
    const fromUsername = fromUserSnap.exists()
      ? fromUserSnap.data().username
      : "Anonymous";

    // Find recipient UID by username
    const usersQuery = query(
      collection(db, "users"),
      where("username", "==", toUsername)
    );
    const usersSnapshot = await getDocs(usersQuery);
    if (usersSnapshot.empty) {
      throw new Error(`No user found with username: ${toUsername}`);
    }

    const toUserDoc = usersSnapshot.docs[0];
    const toUserUid = toUserDoc.id;

    // Get challenge info
    const challengeRef = doc(db, "challenges", challengeId);
    const challengeSnap = await getDoc(challengeRef);
    const challengeData = challengeSnap.data();

    // Add to recipient's inbox
    await addDoc(collection(db, "users", toUserUid, "inbox"), {
      challengeId: challengeId,
      title: challengeData.title,
      description: challengeData.description,
      task: challengeData.task,
      duration: challengeData.duration,
      frequency: challengeData.frequency,
      repeat_days: challengeData.repeat_days,
      points: challengeData.points,
      fromUid: user.uid,
      fromUsername: fromUsername,
      toUsername: toUsername,
      type: "Collaborate",
      createdAt: new Date(),
      isRead: false
    });
  } catch (error) {
    console.error("Failed to send invite:", error);
    throw error;
  }
};

export const acceptInvite = async (invite) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const challengeId = invite.challengeId;

    const globalChallengeRef = doc(db, "collaborations", challengeId);

    const globalChallengeData = {
      title: invite.title,
      description: invite.description,
      task: invite.task,
      duration: invite.duration,
      frequency: invite.frequency,
      repeat_days: invite.repeat_days,
      points: invite.points,
      is_completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: 0,
      collaborators: [user.uid, invite.fromUid],
      isCollaborative: true,
    };

    await setDoc(globalChallengeRef, globalChallengeData, { merge: true });

    const userAcceptedRef = doc(
      db,
      "users",
      user.uid,
      "accepted_challenges",
      challengeId
    );
    const collaboratorAcceptedRef = doc(
      db,
      "users",
      invite.fromUid,
      "accepted_challenges",
      challengeId
    );

    const userRefData = {
      challengeId,
      isCollaborative: true,
      acceptedAt: new Date(),
      title: invite.title,
      description: invite.description,
      task: invite.task,
      duration: invite.duration,
      frequency: invite.frequency,
      repeat_days: invite.repeat_days,
      points: invite.points,
      is_completed: false,
      progress: 0,
      collaborators: [user.uid, invite.fromUid],
    };

    await setDoc(userAcceptedRef, userRefData);
    await setDoc(collaboratorAcceptedRef, userRefData);

    const inviteRef = doc(db, "users", user.uid, "inbox", invite.id);
    await deleteDoc(inviteRef);

    const collaboratorInboxRef = collection(
      db,
      "users",
      invite.fromUid,
      "inbox"
    );
    await addDoc(collaboratorInboxRef, {
      type: "Announcement",
      title: "Invitation Accepted",
      description: `${
        invite.toUsername || "Someone"
      } accepted your challenge invite for "${invite.title}".`,
      createdAt: new Date(),
      isRead: false
    });

    // alert("Challenge accepted!");
    Dialog.show({
      type: ALERT_TYPE.SUCCESS,
      title: "Challenge accepted!",
      textBody: "Collaborated challenge has been accepted!",
      button: "OK",
    });
  } catch (error) {
    // alert("Declined Invite");
    /*
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: "Challenge declined!",
      textBody: "Collaborated challenge has been declined",
      button: "OK",
    });
    */
  }
};

export const declineInvite = async (invite) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const inviteRef = doc(db, "users", user.uid, "inbox", invite.id);
    await deleteDoc(inviteRef);

    const senderRef = collection(db, "users", invite.fromUid, "inbox");
    await addDoc(senderRef, {
      type: "Invitation_declined",
      message: `${
        invite.toUsername || "Invitee"
      } has declined your invite for the challenge "${
        invite.title || "Unknown Challenge"
      }."`,
      timestamp: new Date(),
      isRead: false
    });

    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: "Challenge declined!",
      textBody: "Collaborated challenge has been declined",
      button: "OK",
    });
  } catch (error) {
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: "Failed to decline invite",
      textBody: error,
      button: "OK",
    });
  }
};

// discussion General/Other
export const fetchGeneralDiscussions = async () => {
  try {
    const discussionsQuery = query(
      collection(db, "discussion_board_general"),
      orderBy("createdAt", "desc")
    );
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
    const discussionsQuery = query(
      collection(db, "discussion_board_challenges"),
      orderBy("createdAt", "desc")
    );
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
    const commentsCollection = collection(
      db,
      "discussion_board_general",
      postId,
      "comments"
    );
    const commentSnapshot = await getDocs(commentsCollection);

    const comments = await Promise.all(
      commentSnapshot.docs.map(async (doc) => {
        const repliesCollection = collection(
          db,
          "discussion_board_general",
          postId,
          "comments",
          doc.id,
          "replies"
        );
        const repliesSnapshot = await getDocs(repliesCollection);
        const replies = repliesSnapshot.docs.map((reply) => ({
          id: reply.id,
          ...reply.data(),
        }));
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

    const username = userDocSnap.exists()
      ? userDocSnap.data().username
      : "Anonymous";

    const commentRef = collection(
      db,
      "discussion_board_general",
      postId,
      "comments"
    );
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
    const username = userDocSnap.exists()
      ? userDocSnap.data().username
      : "Anonymous";

    const replyRef = collection(
      db,
      "discussion_board_general",
      postId,
      "comments",
      commentId,
      "replies"
    );
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
    const commentsCollection = collection(
      db,
      "discussion_board_challenges",
      postId,
      "comments"
    );
    const commentSnapshot = await getDocs(commentsCollection);

    const comments = await Promise.all(
      commentSnapshot.docs.map(async (doc) => {
        const repliesCollection = collection(
          db,
          "discussion_board_challenges",
          postId,
          "comments",
          doc.id,
          "replies"
        );
        const repliesSnapshot = await getDocs(repliesCollection);
        const replies = repliesSnapshot.docs.map((reply) => ({
          id: reply.id,
          ...reply.data(),
        }));
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

    const username = userDocSnap.exists()
      ? userDocSnap.data().username
      : "Anonymous";

    const commentRef = collection(
      db,
      "discussion_board_challenges",
      postId,
      "comments"
    );
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
    const username = userDocSnap.exists()
      ? userDocSnap.data().username
      : "Anonymous";

    const replyRef = collection(
      db,
      "discussion_board_challenges",
      postId,
      "comments",
      commentId,
      "replies"
    );
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
export const addGeneralDiscussion = async (
  title,
  description,
  imageURL = ""
) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const userDocSnap = await getDoc(doc(db, "users", user.uid));
  const username = userDocSnap.exists()
    ? userDocSnap.data().username
    : "Anonymous";
  const avatar = userDocSnap.exists()
    ? userDocSnap.data().photoUrl
    : "https://s3-alpha-sig.figma.com/img/8b62/1cd5/3edeeae6fe3616bdf2812d44e6f4f6ef?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=emv7w1QsDjwmrYSiKtEgip8jIWylb3Y-X19pOuAS4qkod6coHm-XpmS8poEzUjvqiikwbYp1yQNL1J4O6C9au3yiy-c95qnrtmWFJtvHMLHCteLJjhQgOJ0Kdm8tsw8kzw7NhZAOgMzMJ447deVzCecPcSPRXLGCozwYFYRmdCRtkwJ9JBvM~4jqBKIiryVGeEED5ZIOQsC1yZsYrcSCAnKjZb7eBcRr1iHfH-ihDA9Z1UPAEJ5vTau7aMvNnaHD56wt~jNx0jf8wvQosLhmMigGvqx5dnV~3PpavHpfs6DJclhW3pv9BJ25ZH9nLuNAfAW6a2X4Qw4KLESnH6fVGg__";

  if (!user) throw new Error("Not logged in");

  const docRef = await addDoc(collection(db, "discussion_board_general"), {
    title,
    description,
    userID: user.uid,
    username,
    avatarUrl:
      avatar ||
      "https://s3-alpha-sig.figma.com/img/8b62/1cd5/3edeeae6fe3616bdf2812d44e6f4f6ef?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=emv7w1QsDjwmrYSiKtEgip8jIWylb3Y-X19pOuAS4qkod6coHm-XpmS8poEzUjvqiikwbYp1yQNL1J4O6C9au3yiy-c95qnrtmWFJtvHMLHCteLJjhQgOJ0Kdm8tsw8kzw7NhZAOgMzMJ447deVzCecPcSPRXLGCozwYFYRmdCRtkwJ9JBvM~4jqBKIiryVGeEED5ZIOQsC1yZsYrcSCAnKjZb7eBcRr1iHfH-ihDA9Z1UPAEJ5vTau7aMvNnaHD56wt~jNx0jf8wvQosLhmMigGvqx5dnV~3PpavHpfs6DJclhW3pv9BJ25ZH9nLuNAfAW6a2X4Qw4KLESnH6fVGg__",
    createdAt: new Date().toISOString(),
    likes: 0,
    imageURL: imageURL || "",
  });

  return docRef.id;
};

export const toggleLike = async (postId, isChallenge = true) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const currentUserId = auth.currentUser?.uid;
  if (!user) throw new Error("Not logged in");

  const collectionName = isChallenge
    ? "discussion_board_challenges"
    : "discussion_board_general";
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
export const deleteGeneralDiscussion = async (postId) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");
    //console.log("user:",user);
    //console.log("currentUser id:",user.uid);

    const postRef = doc(db, "discussion_board_general", postId);

    const postSnap = await getDoc(postRef);
    if (!postSnap.exists()) throw new Error("Post does not exist"); //check if the post is exists
    const postData = postSnap.data();
    if (postData.userID !== user.uid) {
      //check only the owner can delet post
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
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");

    const commentRef = doc(
      db,
      "discussion_board_general",
      postId,
      "comments",
      commentId
    );
    await deleteDoc(commentRef);
    return true;
  } catch (err) {
    console.error("Failed to add comment:", err);
    return false;
  }
};
export const deleteGeneralReply = async (postId, commentId, replyId) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");

    const replyRef = doc(
      db,
      "discussion_board_general",
      postId,
      "comments",
      commentId,
      "replies",
      replyId
    );
    await deleteDoc(replyRef);
    return true;
  } catch (err) {
    console.error("Failed to delete reply:", err);
    return false;
  }
};

//delete Challenge Discussion part
export const deleteChallengeDiscussion = async (postId) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");

    const postRef = doc(db, "discussion_board_challenges", postId);

    const postSnap = await getDoc(postRef);
    if (!postSnap.exists()) throw new Error("Post does not exist"); //check if the post is exists
    const postData = postSnap.data();
    if (postData.userID !== user.uid) {
      //check only the owner can delet post
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
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");

    const commentRef = doc(
      db,
      "discussion_board_challenges",
      postId,
      "comments",
      commentId
    );
    await deleteDoc(commentRef);
    return true;
  } catch (err) {
    console.error("Failed to delete Comment:", err);
    return false;
  }
};
export const deleteChallengeReply = async (postId, commentId, replyId) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");

    const replyRef = doc(
      db,
      "discussion_board_challenges",
      postId,
      "comments",
      commentId,
      "replies",
      replyId
    );
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

export const addDiscussionChallenge = async (
  title,
  description,
  linkedChallengeId,
  imageURL = ""
) => {
  const auth = getAuth();
  const user = auth.currentUser;
  //console.log("auth infom:", auth.currentUser);
  const userDocSnap = await getDoc(doc(db, "users", user.uid));
  const username = userDocSnap.exists()
    ? userDocSnap.data().username
    : "Anonymous";
  const avatar = userDocSnap.exists()
    ? userDocSnap.data().photoUrl
    : "https://s3-alpha-sig.figma.com/img/8b62/1cd5/3edeeae6fe3616bdf2812d44e6f4f6ef?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=emv7w1QsDjwmrYSiKtEgip8jIWylb3Y-X19pOuAS4qkod6coHm-XpmS8poEzUjvqiikwbYp1yQNL1J4O6C9au3yiy-c95qnrtmWFJtvHMLHCteLJjhQgOJ0Kdm8tsw8kzw7NhZAOgMzMJ447deVzCecPcSPRXLGCozwYFYRmdCRtkwJ9JBvM~4jqBKIiryVGeEED5ZIOQsC1yZsYrcSCAnKjZb7eBcRr1iHfH-ihDA9Z1UPAEJ5vTau7aMvNnaHD56wt~jNx0jf8wvQosLhmMigGvqx5dnV~3PpavHpfs6DJclhW3pv9BJ25ZH9nLuNAfAW6a2X4Qw4KLESnH6fVGg__";

  if (!user) throw new Error("Not logged in");

  const docRef = await addDoc(collection(db, "discussion_board_challenges"), {
    title,
    description,
    linkedChallengeId,
    userID: user.uid,
    username,
    avatarUrl:
      avatar ||
      "https://s3-alpha-sig.figma.com/img/8b62/1cd5/3edeeae6fe3616bdf2812d44e6f4f6ef?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=emv7w1QsDjwmrYSiKtEgip8jIWylb3Y-X19pOuAS4qkod6coHm-XpmS8poEzUjvqiikwbYp1yQNL1J4O6C9au3yiy-c95qnrtmWFJtvHMLHCteLJjhQgOJ0Kdm8tsw8kzw7NhZAOgMzMJ447deVzCecPcSPRXLGCozwYFYRmdCRtkwJ9JBvM~4jqBKIiryVGeEED5ZIOQsC1yZsYrcSCAnKjZb7eBcRr1iHfH-ihDA9Z1UPAEJ5vTau7aMvNnaHD56wt~jNx0jf8wvQosLhmMigGvqx5dnV~3PpavHpfs6DJclhW3pv9BJ25ZH9nLuNAfAW6a2X4Qw4KLESnH6fVGg__",
    createdAt: new Date().toISOString(),
    likes: 0,
    imageURL: imageURL || "",
  });

  return docRef.id;
};

// Challenge filter
export const filterForChallenge = async (duration, frequency, points) => {
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
    if (points !== "Null" && points !== null) {
      challengeQuery = query(
        challengeQuery,
        where("points", "==", parseInt(points))
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
      id: doc.id,
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
//   const challenges = await filterForChallenge("Null", "Null", "48"); // Example duration and frequency
//   console.log(challenges); // Check the filtered challenges in the console
// };
// testFilter();

export const sortForChallenge = async (sortItem, sortDirection) => {
  try {
    const challengesCollection = collection(db, "challenges");
    //Get colletion
    let challengeQuery = query(challengesCollection);
    // Check for Null value
    if (sortItem !== "Null" && sortDirection !== "Null") {
      challengeQuery = query(
        challengesCollection,
        orderBy(sortItem, sortDirection) // Sort function for database
      );
    } else if (sortItem !== "Null") {
      challengeQuery = query(challengesCollection, orderBy(sortItem, "asc")); // Default to ascending order if Null
    } else {
      query(challengesCollection); // Default order if both value are Null
    }
    const challengeQuerySnapshot = await getDocs(challengeQuery);
    // Get data
    return challengeQuerySnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      task: doc.data().task,
      description: doc.data().description,
      duration: doc.data().duration,
      frequency: doc.data().frequency,
      points: doc.data().points,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching and sorting challenges:", error);
    return [];
  }
};

// Test sorting function
// const testSort = async () => {
//   try {
//     const sortingChallenges = await sortForChallenge("points", "Null");
//     const titles = sortingChallenges.map((challenge) => ({
//       title: challenge.title,
//       // frequency: challenge.frequency,
//       // duration: challenge.duration,
//       ponits: challenge.points,
//     }));
//     console.log("Titles:", titles);
//   } catch (error) {
//     console.error("Error in Sorting:", error);
//   }
// };
// testSort();

// Fetching points for leader board
export const fetchUserPoints = async (setPoints) => {
  try {
    const usersCollection = collection(db, "users"); // Get user collection
    const pointQuery = query(usersCollection, orderBy("points", "desc")); // Sort by points to get rank
    const pointSnapshot = onSnapshot(pointQuery, (usersSnapshot) => {
      let pointsList = [];
      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        pointsList.push({
          // Push data fetched into the array
          userId: doc.id,
          userName: userData.username ?? "Anonymous",
          points: userData.points ?? 0,
          photoUrl: userData.photoUrl ?? null,
        });
      });
      pointsList = pointsList.map((user, index) => ({
        ...user,
        rank: index + 1, // Get rank for each user
      }));
      setPoints(pointsList);
    });

    return pointSnapshot;
  } catch (error) {
    console.error("Error fetching points:", error);
    return null;
  }
};
export const fetchCompletedChallenges = (setCompletedChallenges) => {
  try {
    const user = getAuth().currentUser;
    if (!user) {
      console.log("No user is signed in");
      return null;
    }
    const completedCollection = collection(
      db,
      "users",
      user.uid,
      "completed_challenges"
    );
    const completedQuery = query(
      completedCollection,
      orderBy("completedAt", "desc"),
      limit(5) // Limit to recent 5
    );
    const completedSnapshot = onSnapshot(completedQuery, (snapshot) => {
      const challengesList = snapshot.docs.map((doc) => ({
        id: doc.id,
        completedAt: doc.data().completedAt,
        ...doc.data(),
      }));

      setCompletedChallenges(challengesList);
    });

    return completedSnapshot;
  } catch (error) {
    console.error("Error fetching completed challenges:", error);
    return null;
  }
};

export const displayWinner = async () => {
  try {
    const winnersRef = collection(db, "winners");
    const winner = query(winnersRef, orderBy("month", "desc"), limit(12));
    const querySnapshot = await getDocs(winner);
    const winnersList = [];

    querySnapshot.forEach((doc) => {
      winnersList.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    if (winnersList.length === 0) {
      console.log("No winners found.");
      return [];
    }
    return winnersList;
  } catch (error) {
    console.error("Error fetching winners:", error.message);
    throw error;
  }
};
// displayWinner();
