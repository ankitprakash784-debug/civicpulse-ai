function calculatePriority(severity, safetyRisk, affectedPeople = 1) {
  const peopleScore = Math.min(Math.max(affectedPeople, 1), 5);

  const score = severity * safetyRisk * peopleScore * 4;

  let priority;

  if (score >= 400) {
    priority = "CRITICAL";
  } else if (score >= 250) {
    priority = "HIGH";
  } else if (score >= 100) {
    priority = "MEDIUM";
  } else {
    priority = "LOW";
  }

  return {
    score: Math.min(score, 500),
    priority
  };
}

module.exports = {
  calculatePriority
};