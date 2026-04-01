import { GoogleGenAI } from "@google/genai";

const DEFAULT_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
] as const;

export async function generateGeminiText({
  apiKey,
  prompt,
  temperature = 0.7,
  maxOutputTokens = 256,
  modelCandidates = DEFAULT_MODELS,
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

  for (const modelName of modelCandidates) {
    try {
      const result = await geminiClient.models.generateContent({
        model: modelName,
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

      return { text, model: modelName };
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Unknown Gemini error";
    }
  }

  throw new Error(`Gemini failed: ${lastError}`);
}
