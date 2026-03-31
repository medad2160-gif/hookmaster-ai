import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { niche, tone, lang } = req.body;

  if (!niche) {
    return res.status(400).json({ error: 'Niche is required' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const languageName = lang === 'ar' ? 'Arabic' : 'English';

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a viral TikTok/Instagram hook, video idea, and short script for the niche: "${niche}" with a ${tone} tone. Respond only in the selected language (${languageName}).`,
      config: {
        systemInstruction: `You are a world-class viral content strategist for TikTok and Instagram. Your goal is to create content that stops the scroll and maximizes engagement. Use psychological triggers, curiosity gaps, and high-energy language. You must respond entirely in ${languageName}.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hook: {
              type: Type.STRING,
              description: "A punchy, scroll-stopping hook (max 15 words).",
            },
            videoIdea: {
              type: Type.STRING,
              description: "A brief description of the visual concept for the video.",
            },
            script: {
              type: Type.STRING,
              description: "A short, high-impact script for a 15-30 second video.",
            },
          },
          required: ["hook", "videoIdea", "script"],
        },
      },
    });

    const result = JSON.parse(response.text);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in generateViralContent:", error);
    return res.status(500).json({ error: 'Failed to generate content: ' + error.message });
  }
}
