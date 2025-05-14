import { onSchedule } from "firebase-functions/v2/scheduler";
import { onRequest } from "firebase-functions/v2/https"; 
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

// Get the winner from querying database
const fetchWinner = async () => {
  const usersRef = db.collection("users");
  const winner = usersRef.orderBy("points", "desc").limit(1);
  const snapshot = await winner.get();

  if (snapshot.empty) {
    console.log("No winner found");
    return null;
  }

  const doc = snapshot.docs[0];
  const data = doc.data();
  return {
    username: data.username ?? "Anonymous",
    uid: doc.id,
    points: data.points ?? 0,
    photoUrl: data.photoUrl ?? null,
  };
};
// Add the winner to winners collection
export const addWinner = async (uid, username, points) => {
  try {
    const parsedPoints = parseInt(points, 10);
    const winnersRef = db.collection("winners");
    const winnerData = {
      uid,
      username,
      points: parsedPoints,
      month: new Date(),
    };
    await winnersRef.add(winnerData);
    console.log("Winner added to Firestore:", username, parsedPoints);
  } catch (error) {
    console.error("Error adding winner:", error.message);
    throw error;
  }
};
export const resetPointsMonthly = onSchedule("0 0 1 * *", async (event) => {
  const usersRef = db.collection("users");
  const snapshot = await usersRef.get();
  const winner = await fetchWinner();
    if (winner) {
      await addWinner(winner.uid,winner.username, winner.points);
    }
  const batch = db.batch();
  snapshot.forEach((doc) => {
    batch.update(doc.ref, { points: 0 });
  });

  await batch.commit();
  console.log("Monthly points reset for all users");
});

export const resetPointsNow = onRequest(async (req, res) => {
  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();
    const winner = await fetchWinner();
    if (winner) {
      await addWinner(winner.uid,winner.username, winner.points);
    }
    const batch = db.batch();
    snapshot.forEach((doc) => {
      batch.update(doc.ref, { points: 0 });
    });

    await batch.commit();
    console.log("Points reset manually via HTTP request");
    res.status(200).send("Points reset successfully");
  } catch (error) {
    console.error("Manual reset failed:", error);
    res.status(500).send("Error resetting points");
  }
});
//https://us-central1-habitflow-499.cloudfunctions.net/resetPointsNow

//New function
// https://resetpointsnow-4lekr5zfua-uc.a.run.app