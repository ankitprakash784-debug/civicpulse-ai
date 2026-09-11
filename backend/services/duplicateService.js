function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(
    Math.sqrt(a),
    Math.sqrt(1 - a)
  );

  return R * c;
}

function normalizeText(text = "") {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

function calculateTextSimilarity(text1, text2) {
  const words1 = new Set(normalizeText(text1));
  const words2 = new Set(normalizeText(text2));

  if (words1.size === 0 || words2.size === 0) {
    return 0;
  }

  let commonWords = 0;

  for (const word of words1) {
    if (words2.has(word)) {
      commonWords++;
    }
  }

  return commonWords / Math.max(words1.size, words2.size);
}

function checkDuplicateComplaint(
  newComplaint,
  existingComplaints = []
) {
  const {
    issueType,
    latitude,
    longitude,
    description
  } = newComplaint;

  for (const complaint of existingComplaints) {
    // Different issue = not duplicate
    if (complaint.issueType !== issueType) {
      continue;
    }

    // Check location within 500 meters
    if (
      latitude !== undefined &&
      longitude !== undefined &&
      complaint.latitude !== undefined &&
      complaint.longitude !== undefined
    ) {
      const distance = calculateDistance(
        latitude,
        longitude,
        complaint.latitude,
        complaint.longitude
      );

      if (distance <= 0.5) {
        return {
          isDuplicate: true,
          duplicateComplaintId: complaint.id,
          distanceInKm: Number(distance.toFixed(3)),
          reason: "Same issue type reported within 500 meters"
        };
      }
    }

    // Check description similarity
    if (description && complaint.description) {
      const similarity = calculateTextSimilarity(
        description,
        complaint.description
      );

      if (similarity >= 0.6) {
        return {
          isDuplicate: true,
          duplicateComplaintId: complaint.id,
          similarity: Number(similarity.toFixed(2)),
          reason: "Complaint descriptions are highly similar"
        };
      }
    }
  }

  return {
    isDuplicate: false,
    duplicateComplaintId: null,
    reason: "No duplicate complaint found"
  };
}

module.exports = {
  calculateDistance,
  calculateTextSimilarity,
  checkDuplicateComplaint
};