import { generateGeminiText, hasGeminiApiKey } from "@/lib/gemini";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

interface GeneratePostBody {
  prompt?: string;
  locale?: string;
}

const DEFAULT_PROMPT = "Write a short social post";
const MAX_PROMPT_LENGTH = 500;
const MAX_POST_LENGTH = 280;

function cleanPrompt(prompt?: string): string {
  const normalized = prompt?.replace(/\s+/g, " ").trim() ?? "";
  return normalized.slice(0, MAX_PROMPT_LENGTH) || DEFAULT_PROMPT;
}

function cleanOutput(text: string): string {
  const normalized = text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\s+\n/g, "\n")
    .trim();

  return normalized.slice(0, MAX_POST_LENGTH);
}

function buildPromptText(prompt: string, locale: "zh-CN" | "en"): string {
  const languageInstruction =
    locale === "zh-CN"
      ? "Please respond in Simplified Chinese."
      : "Please respond in concise English.";

  return [
    "You are a social media writing assistant.",
    languageInstruction,
    `Generate 1 short post under ${MAX_POST_LENGTH} characters.`,
    "Style: natural and human. No markdown. No quotation marks.",
    `Topic: ${prompt}`,
  ].join("\n");
}

function buildLocalDraft(prompt: string, locale: "zh-CN" | "en"): string {
  const topic = prompt.slice(0, 40);
  if (locale === "zh-CN") {
    return `今天在想一件事：${topic}。先把这个想法记下来，欢迎大家聊聊你们的看法。`;
  }

  return `Quick thought today: ${topic}. Dropping this here first, curious how you see it.`;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as GeneratePostBody;
    const prompt = cleanPrompt(body.prompt);
    const locale: "zh-CN" | "en" = body.locale === "zh-CN" ? "zh-CN" : "en";
    const promptText = buildPromptText(prompt, locale);

    if (!hasGeminiApiKey()) {
      const localDraft = buildLocalDraft(prompt, locale);
      return NextResponse.json({
        content: cleanOutput(localDraft),
        success: true,
        source: "local-fallback",
        warning: "Missing Gemini API key, local fallback used",
      });
    }

    try {
      const { text, model } = await generateGeminiText({
        prompt: promptText,
        temperature: 0.85,
        maxOutputTokens: 220,
        modelCandidates: ["gemini-2.0-flash", "gemini-1.5-flash"],
      });

      const content = cleanOutput(text);
      if (!content) {
        throw new Error("Gemini returned empty content");
      }

      return NextResponse.json({ content, success: true, source: `gemini:${model}` });
    } catch (error) {
      const localDraft = buildLocalDraft(prompt, locale);
      const warning =
        error instanceof Error ? error.message : "Gemini request failed";

      return NextResponse.json({
        content: cleanOutput(localDraft),
        success: true,
        source: "local-fallback",
        warning,
      });
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate AI post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
