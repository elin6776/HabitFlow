import { onSchedule } from "firebase-functions/v2/scheduler";
import { onRequest } from "firebase-functions/v2/https"; 
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

export const resetPointsMonthly = onSchedule("0 0 1 * *", async (event) => {
  const usersRef = db.collection("users");
  const snapshot = await usersRef.get();

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