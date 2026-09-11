const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function analyzeCivicImage(imageBase64, mimeType) {
  const prompt = `
You are CivicPulse AI, a civic infrastructure inspection assistant.

Analyze the provided image and identify whether it contains one of these civic issues:

- pothole
- garbage
- broken streetlight
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

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType,
              data: imageBase64
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
  analyzeCivicImage
};