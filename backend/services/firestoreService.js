const { db } = require("../config/firebase");

async function createComplaint(complaintData) {
  const now = new Date().toISOString();

  const docRef = await db.collection("complaints").add({
    ...complaintData,
    createdAt: now,
    updatedAt: now,
  });

  return {
    id: docRef.id,
    ...complaintData,
  };
}

async function getComplaints() {
  const snapshot = await db
    .collection("complaints")
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// Update complaint status in Firestore
async function updateComplaintStatus(complaintId, status) {
  const complaintRef = db
    .collection("complaints")
    .doc(complaintId);

  await complaintRef.update({
    status,
    updatedAt: new Date().toISOString(),
  });

  return {
    id: complaintId,
    status,
  };
}

module.exports = {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
};