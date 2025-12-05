import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

// Helper to safely access process.env
const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Ignore
  }
  return '';
};

const apiKey = getApiKey();
let ai: GoogleGenAI | null = null;

// Only initialize if we have a key, otherwise leave null
if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey: apiKey });
  } catch (error) {
    console.error("Failed to initialize Gemini AI:", error);
  }
}

export const askArchive = async (query: string, lang: Language): Promise<string> => {
  // Guard clause: If AI didn't initialize, return localized fallback immediately
  if (!ai) {
    const errorMessages = {
      en: "The archive intelligence service is currently unavailable (API Key missing).",
      so: "Adeegga sirdoonka kaydka hadda ma shaqaynayo (Furaha API ayaa maqan).",
      ar: "خدمة ذكاء الأرشيف غير متاحة حاليًا (مفتاح API مفقود)."
    };
    return errorMessages[lang] || errorMessages.en;
  }

  try {
    const languageNames = {
      en: "English",
      so: "Somali",
      ar: "Arabic"
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User Query: ${query}`,
      config: {
        systemInstruction: `You are the Head Archivist for 'SomaliPin', a prestigious digital registry of Somali excellence. 
        Your tone is authoritative, objective, and respectful, similar to an encyclopedia or a government historian.
        
        Provide a concise summary (max 150 words) regarding the user's query about Somali figures, history, or business. 
        Focus on verified achievements and historical significance. 
        If the query is vague, politely ask for clarification.
        Do not use markdown formatting like bolding or headers, just plain text paragraphs.
        
        IMPORTANT: The user has selected ${languageNames[lang]} as their preferred language. You MUST reply in ${languageNames[lang]}.`,
        temperature: 0.3, // Low temperature for factual accuracy
      }
    });

    return response.text || "No records found in the archive at this time.";
  } catch (error) {
    console.error("Archive retrieval failed:", error);
    return "The archive service is currently unavailable. Please try again later.";
  }
};