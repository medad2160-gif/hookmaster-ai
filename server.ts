import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route
  app.post("/api/generate", async (req, res) => {
    const { niche, tone, lang } = req.body;
    let apiKey = process.env.GEMINI_API_KEY;

    // تنظيف المفتاح من المسافات أو علامات التنصيص الزائدة
    if (apiKey) {
      apiKey = apiKey.replace(/['"]+/g, '').trim();
    }

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "") {
      return res.status(500).json({ 
        error: "مفتاح الـ API غير مضبوط بشكل صحيح. يرجى التأكد من إضافة GEMINI_API_KEY في إعدادات Secrets." 
      });
    }

    try {
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
              hook: { type: Type.STRING },
              videoIdea: { type: Type.STRING },
              script: { type: Type.STRING },
            },
            required: ["hook", "videoIdea", "script"],
          },
        },
      });

      const result = JSON.parse(response.text);
      res.json(result);
    } catch (error) {
      console.error(error);
      let errorMessage = "فشل في إنشاء المحتوى";
      const errorStr = (error as Error).message || "";
      
      if (errorStr.includes('429') || errorStr.includes('quota') || errorStr.includes('RESOURCE_EXHAUSTED')) {
        errorMessage = "لقد وصلت إلى الحد الأقصى المسموح به لليوم. يرجى المحاولة لاحقاً.";
      }
      
      res.status(500).json({ error: errorMessage });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
