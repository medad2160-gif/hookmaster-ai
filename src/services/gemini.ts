import { GoogleGenAI, Type } from "@google/genai";
import { ViralContent, Tone } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export async function generateViralContent(niche: string, tone: Tone, lang: 'en' | 'ar' = 'en'): Promise<ViralContent> {
  try {
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

    const text = response.text || "{}";
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    const result = JSON.parse(cleanText);
    
    return {
      ...result,
      tone,
      niche,
      lang,
    };
  } catch (error) {
    console.error("Error in generateViralContent:", error);
    throw error;
  }
}
