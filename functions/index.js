const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

exports.resetPointsMonthly = functions.https.onRequest(async (req, res) => {
  try {
    const currentDate = new Date();
    if (currentDate.getDate() !== 1) {
      return res.status(400).send('Reset only on 1st of the month.');
    }

    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();

    const batch = db.batch();
    snapshot.forEach(doc => {
      batch.update(doc.ref, { points: 0 });
    });

    await batch.commit();
    console.log('Monthly points reset for all users');
    res.status(200).send('Monthly points reset successfully');
  } catch (error) {
    console.error('Error resetting points monthly:', error);
    res.status(500).send('Error resetting points');
  }
});
//https://us-central1-habitflow-499.cloudfunctions.net/resetPointsMonthly

// Test
exports.resetPointsNow = functions.https.onRequest(async (req, res) => {
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();

    const batch = db.batch();
    snapshot.forEach(doc => {
      batch.update(doc.ref, { points: 0 });
    });

    await batch.commit();
    console.log('Points reset manually via HTTP request');
    res.status(200).send('Points reset successfully');
  } catch (error) {
    console.error('Manual reset failed:', error);
    res.status(500).send('Error resetting points');
  }
});
//https://us-central1-habitflow-499.cloudfunctions.net/resetPointsNow