function generateComplaint(analysis, location = "Location not provided") {
  const {
    issueType,
    severity,
    safetyRisk,
    description,
    department,
    priorityScore,
    priority
  } = analysis;

  const issueName = issueType
    .replace("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const complaint = `
Subject: ${priority} Priority Civic Issue – ${issueName}

To,
${department}

Dear Sir/Madam,

I would like to report a civic infrastructure issue that requires attention.

Issue Type: ${issueName}
Description: ${description}
Severity: ${severity}/5
Safety Risk: ${safetyRisk}/5
Priority Score: ${priorityScore}
Priority Level: ${priority}
Location: ${location}

This issue may affect public safety and should be inspected and resolved at the earliest possible time.

Kindly take the necessary action and update the status of this complaint once the issue has been resolved.

Regards,
CivicPulse Citizen
`;

  return complaint.trim();
}

module.exports = {
  generateComplaint
};