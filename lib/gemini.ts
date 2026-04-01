import { GoogleGenAI } from "@google/genai";
import { DEFAULT_GEMINI_MODEL, type GeminiModel, normalizeGeminiModel } from "@/lib/gemini-model";

export async function generateGeminiText({
  apiKey,
  prompt,
  temperature = 0.7,
  maxOutputTokens = 256,
  modelCandidates,
  preferredModel,
}: {
  apiKey: string;
  prompt: string;
  temperature?: number;
  maxOutputTokens?: number;
  modelCandidates?: readonly GeminiModel[];
  preferredModel?: GeminiModel;
}): Promise<{ text: string; model: string }> {
  const normalizedApiKey = apiKey.trim();
  if (!normalizedApiKey) {
    throw new Error("Gemini API key is not configured");
  }

  const geminiClient = new GoogleGenAI({ apiKey: normalizedApiKey });
  let lastError = "Unknown Gemini error";
  const candidates = modelCandidates && modelCandidates.length
    ? modelCandidates
    : [preferredModel ?? DEFAULT_GEMINI_MODEL];
  const dedupedCandidates = Array.from(
    new Set(candidates.map((model) => normalizeGeminiModel(model)))
  );

  for (const model of dedupedCandidates) {
    try {
      const result = await geminiClient.models.generateContent({
        model,
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

      return { text, model };
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Unknown Gemini error";
    }
  }

  throw new Error(`Gemini failed: ${lastError}`);
}
