import { GoogleGenAI } from "@google/genai";

const DEFAULT_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
] as const;

const geminiApiKey =
  process.env.GEMINI_API_KEY?.trim() ||
  process.env.GOOGLE_API_KEY?.trim() ||
  process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ||
  "";
console.log("Gemini API Key configured:", geminiApiKey);
let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!geminiApiKey) {
    throw new Error("Gemini API key is not configured");
  }

  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey: geminiApiKey });
  }

  return geminiClient;
}

export function hasGeminiApiKey(): boolean {
  return Boolean(geminiApiKey);
}

export async function generateGeminiText({
  prompt,
  temperature = 0.7,
  maxOutputTokens = 256,
  modelCandidates = DEFAULT_MODELS,
}: {
  prompt: string;
  temperature?: number;
  maxOutputTokens?: number;
  modelCandidates?: readonly string[];
}): Promise<{ text: string; model: string }> {
  let lastError = "Unknown Gemini error";

  for (const modelName of modelCandidates) {
    try {
      const result = await getGeminiClient().models.generateContent({
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
