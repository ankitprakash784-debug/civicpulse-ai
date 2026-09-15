const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateVerification(
  model,
  prompt,
  beforeImageBase64,
  beforeMimeType,
  afterImageBase64,
  afterMimeType
) {
  return await ai.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [
          {
            text: prompt
          },
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
}

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
- sameIssue must be true only when the images appear to show the same issue/location
- Do not include markdown or explanations outside JSON.
`;

  const models = [
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite"
  ];

  let lastError;

  for (const model of models) {
    try {
      console.log(`🤖 Resolution verification using ${model}`);

      const response = await generateVerification(
        model,
        prompt,
        beforeImageBase64,
        beforeMimeType,
        afterImageBase64,
        afterMimeType
      );

      const text = response.text;

      const cleanedText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const result = JSON.parse(cleanedText);

      console.log(`✅ Resolution verification succeeded with ${model}`);

      return result;
    } catch (error) {
      lastError = error;

      console.error(
        `❌ Resolution verification failed with ${model}:`,
        error.message
      );

      // Small delay before trying fallback model
      await sleep(1500);
    }
  }

  throw lastError;
}

module.exports = {
  analyzeResolutionImages
};