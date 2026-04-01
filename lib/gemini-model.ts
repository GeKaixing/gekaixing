export const GEMINI_MODEL_OPTIONS = [
  "gemini-3.1-flash-lite-preview",
  "gemini-3.1-flash-live-preview",
  "gemini-3-flash-preview",
  "gemini-2.5-pro",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
] as const;

export type GeminiModel = (typeof GEMINI_MODEL_OPTIONS)[number];

export const DEFAULT_GEMINI_MODEL: GeminiModel = "gemini-3-flash-preview";

export function isGeminiModel(value: string): value is GeminiModel {
  return (GEMINI_MODEL_OPTIONS as readonly string[]).includes(value);
}

export function normalizeGeminiModel(value: unknown): GeminiModel {
  if (typeof value !== "string") {
    return DEFAULT_GEMINI_MODEL;
  }

  const normalized = value.trim();
  return isGeminiModel(normalized) ? normalized : DEFAULT_GEMINI_MODEL;
}

export function getGeminiModelCandidates(preferredModel: unknown): GeminiModel[] {
  const preferred = normalizeGeminiModel(preferredModel);
  const rest = GEMINI_MODEL_OPTIONS.filter((model) => model !== preferred);
  return [preferred, ...rest];
}
