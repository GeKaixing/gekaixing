import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const FALLBACK_GEMINI_API_KEY = "AIzaSyB_bq-R7LHTQE0PFTpAzwZbb9FVrN1MfDw";
const DEFAULT_MODELS = ["gemini-2.0-flash", "gemini-1.5-flash"] as const;

const geminiApiKey =
  process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() || FALLBACK_GEMINI_API_KEY;

const geminiProvider = createGoogleGenerativeAI({
  apiKey: geminiApiKey,
});

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
      const result = await generateText({
        model: geminiProvider(modelName),
        temperature,
        maxOutputTokens,
        prompt,
      });

      return { text: result.text, model: modelName };
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Unknown Gemini error";
    }
  }

  throw new Error(`Gemini failed: ${lastError}`);
}
