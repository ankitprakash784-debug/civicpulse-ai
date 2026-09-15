const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const prompt = `
You are CivicPulse AI, a civic infrastructure inspection assistant.

Analyze the provided image and identify whether it contains one of these civic issues:

- pothole
- garbage
- broken_streetlight
- water_leak
- other

Return ONLY valid JSON in this exact format:

{
  "issueType": "pothole",
  "confidence": 0.94,
  "severity": 5,
  "safetyRisk": 5,
  "description": "Large pothole on road",
  "department": "Road Department"
}

Rules:
- confidence must be between 0 and 1
- severity must be an integer from 1 to 5
- safetyRisk must be an integer from 1 to 5
- severity 1 = very minor
- severity 5 = critical
- safetyRisk 1 = minimal risk
- safetyRisk 5 = extreme risk

Department mapping:
pothole → Road Department
garbage → Sanitation Department
broken_streetlight → Electrical Department
water_leak → Water Department
other → General Civic Department

Do not include markdown or explanations outside the JSON.
`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateWithRetry(
  model,
  imageBase64,
  mimeType,
  maxAttempts = 2
) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(
        `🤖 Gemini ${model} attempt ${attempt}/${maxAttempts}`
      );

      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType,
                  data: imageBase64,
                },
              },
            ],
          },
        ],
      });

      return response;
    } catch (error) {
      lastError = error;

      console.error(
        `Gemini ${model} attempt ${attempt} failed:`,
        error.message
      );

      if (attempt < maxAttempts) {
        const delay = attempt * 2000;

        console.log(
          `⏳ Retrying in ${delay / 1000}s...`
        );

        await sleep(delay);
      }
    }
  }

  throw lastError;
}

async function analyzeCivicImage(
  imageBase64,
  mimeType
) {
  const models = [
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
];

  let lastError;

  for (const model of models) {
    try {
      const response = await generateWithRetry(
        model,
        imageBase64,
        mimeType,
        2
      );

      const text = response.text;

      const cleanedText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      return JSON.parse(cleanedText);
    } catch (error) {
      lastError = error;

      console.error(
        `❌ Model ${model} failed. Trying fallback model...`
      );
    }
  }

  throw lastError;
}

module.exports = {
  analyzeCivicImage,
};