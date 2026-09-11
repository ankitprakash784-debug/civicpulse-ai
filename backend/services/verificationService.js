const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function analyzeResolutionImages(
  beforeImageBase64,
  beforeMimeType,
  afterImageBase64,
  afterMimeType
) {
  const prompt = `
You are CivicPulse AI, a civic infrastructure repair verification assistant.

You will receive TWO images:

1. BEFORE image — the original civic issue.
2. AFTER image — the same location after a claimed repair.

Compare the images carefully.

Determine:
- What civic issue is visible in the BEFORE image.
- Whether the issue appears resolved in the AFTER image.
- Whether the AFTER image shows meaningful improvement.
- Whether the images appear to show the same type of location/issue.

Return ONLY valid JSON in exactly this format:

{
  "issueType": "pothole",
  "beforeSeverity": 5,
  "afterSeverity": 1,
  "beforeSafetyRisk": 5,
  "afterSafetyRisk": 1,
  "sameIssue": true,
  "resolved": true,
  "confidence": 0.95,
  "reason": "The pothole visible in the before image appears repaired in the after image."
}

Allowed issueType values:
- pothole
- garbage
- broken_streetlight
- water_leak
- other

Rules:
- severity must be an integer from 1 to 5
- safetyRisk must be an integer from 1 to 5
- confidence must be between 0 and 1
- resolved must be true only when the civic issue appears meaningfully fixed
- Do not include markdown or explanations outside JSON.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: beforeMimeType,
              data: beforeImageBase64
            }
          },
          {
            inlineData: {
              mimeType: afterMimeType,
              data: afterImageBase64
            }
          }
        ]
      }
    ]
  });

  const text = response.text;

  const cleanedText = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanedText);
}

module.exports = {
  analyzeResolutionImages
};
