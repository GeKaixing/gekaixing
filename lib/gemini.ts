import { GoogleGenAI } from "@google/genai";
export async function generateGeminiText({
  apiKey,
  prompt,
  temperature = 0.7,
  maxOutputTokens = 256,

}: {
  apiKey: string;
  prompt: string;
  temperature?: number;
  maxOutputTokens?: number;
  modelCandidates?: readonly string[];
}): Promise<{ text: string; model: string }> {
  const normalizedApiKey = apiKey.trim();
  if (!normalizedApiKey) {
    throw new Error("Gemini API key is not configured");
  }

  const geminiClient = new GoogleGenAI({ apiKey: normalizedApiKey });
  let lastError = "Unknown Gemini error";

    try {
      const result = await geminiClient.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          temperature,
          maxOutputTokens,
        },
      });

      const text = (result.text ?? "").trim();
      if (!text) {
        throw new Error("Gemini returned empty content");
      }

      return { text, model: "gemini-3-flash-preview" };
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Unknown Gemini error";
    }


  throw new Error(`Gemini failed: ${lastError}`);
}
