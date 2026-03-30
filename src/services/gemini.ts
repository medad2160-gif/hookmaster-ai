import { GoogleGenAI, Type } from "@google/genai";
import { ViralContent, Tone } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateViralContent(niche: string, tone: Tone, lang: 'en' | 'ar' = 'en'): Promise<ViralContent> {
  const languagePrompt = lang === 'ar' ? ' in Arabic language' : ' in English language';
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a viral TikTok/Instagram hook, video idea, and short script for the niche: "${niche}" with a ${tone} tone${languagePrompt}.`,
    config: {
      systemInstruction: "You are a world-class viral content strategist for TikTok and Instagram. Your goal is to create content that stops the scroll and maximizes engagement. Use psychological triggers, curiosity gaps, and high-energy language.",
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

  const result = JSON.parse(response.text || "{}");
  return {
    ...result,
    tone,
    niche,
  };
}
